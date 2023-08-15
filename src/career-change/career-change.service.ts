import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCareerChangeDto } from './dto/create-career-change.dto';
import { UpdateCareerChangeDto } from './dto/update-career-change.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CareerChange, applicationStatus } from './entities/career-change.entity';
import { In, Repository } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { CenterChange } from 'src/center-change/entities/center-change.entity';
import { Period } from 'src/period/entities/period.entity';
import { ReviewCareerChangeDto, applicationStatusOption } from './dto/review-career-change.dto';

@Injectable()
export class CareerChangeService {

  private readonly logger = new Logger('careerChangeLogger');

  constructor(
    @InjectRepository(CareerChange) private careerChangeRepository: Repository<CareerChange>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(StudentCareer) private studentCareerRepository: Repository<StudentCareer>,
    @InjectRepository(CenterCareer) private centerCareerRepository: Repository<CenterCareer>,
    @InjectRepository(CenterChange) private centerChangeRepository: Repository<CenterChange>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
  ){
  }


  async create({idCareer, justification, justificationPdf, accountNumber , idPeriod}: CreateCareerChangeDto) {
    try {

      const periodExist = await this.periodRepository.findOne({
        where:{
          id: +idPeriod
        }
      });

      if(!periodExist){
        throw new NotFoundException('El periodo proporcionado no existe')
      }

      const careerChangeExist = await this.careerChangeRepository.findOne({
        where:{
          accountNumber: accountNumber,
          applicationStatus: applicationStatus.PROGRESS,
          idPeriod: {
            id: +idPeriod
          }
        },
        relations: ['idPeriod']
      });

      if(careerChangeExist){
        throw new ConflictException('Usted ya realizo una solicitud de cambio de carrera para el periodo actual.')
      }


      const studentExist = JSON.parse(JSON.stringify(await this.studentRepository.findOne({
        where: {
          accountNumber: accountNumber
        },
        relations:['studentCareer','studentCareer.centerCareer','studentCareer.centerCareer.career','studentCareer.centerCareer.regionalCenter']
        // relations:['studentCareer','studentCareer.centerCareer','studentCareer.centerCareer.career']
      })))

      if(!studentExist){
        throw new NotFoundException('El estudiante enviado no existe')
      }

      const requestExist = await this.centerChangeRepository.findOne({
        where: {
          accountNumber: accountNumber,
          applicationStatus: applicationStatus.PROGRESS,
          idPeriod: {
            id: +idPeriod
          }
        },
        relations: ['idPeriod']
      });

      if(requestExist){
        throw new ConflictException('Usted tiene un proceso de cambio de centro regional actualmente')
      }

      if(studentExist.studentCareer[0].centerCareer.career.id == idCareer){
        throw new ConflictException('Usted ya esta matriculado en esta carrera')
      }


      const careerCenterExist = await this.centerCareerRepository.findOne({
        where:{
          regionalCenter: {
            id: studentExist.studentCareer[0].centerCareer.regionalCenter.id
          },
          career: {
            id: idCareer
          }
        }
      });
      if(!careerCenterExist){
        throw new NotFoundException('La carrera enviada no existe en su centro regional actualmente');
      }

      const careerChange = await this.careerChangeRepository.create({
        idCareer: idCareer,
        justification: justification,
        justificationPdf: justificationPdf,
        accountNumber: accountNumber,
        idPeriod: {
          id: +idPeriod
        }
      });

      const saveCareerChange = await this.careerChangeRepository.save(careerChange)

      return {
        statusCode: 200,
        message: this.printMessageLog("La solicitud de cambio de carrera se ha realizado exitosamente."),
        careerChange:saveCareerChange,
        idPeriod: {
          id: +idPeriod
        }
      }


    } catch (error) {
      return this.printMessageError(error);
    }
  }


  async reviewRequest({aplicationStatus, idCareerChange}:ReviewCareerChangeDto){
    try {
      
      const statusAplication = await this.careerChangeRepository.findOne({
        where: {
          idCareerChange: idCareerChange,
          // applicationStatus: In([applicationStatusOption.ACCEPTED,applicationStatusOption.REJECTED])
        }
      });

      if(!statusAplication){
        throw new NotFoundException('Solicitud de cambio de carrera no encontrada');
      }
      if(statusAplication.applicationStatus == applicationStatusOption.ACCEPTED || statusAplication.applicationStatus == applicationStatusOption.REJECTED ){
        throw new ConflictException('La solicitud del estudiante ya fue revisada');
      }

      const createAplication = await this.careerChangeRepository.preload({
        idCareerChange,
        applicationStatus: aplicationStatus,
        applicationDate: new Date().toISOString()
      });

      const saveAplication = await this.careerChangeRepository.save(createAplication);
      return {
        statusCode: 200,
        message: this.printMessageLog("La solicitud del estudiante se actualizo con exito."),
        aplicationRequest: saveAplication
      }
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const allRequestStundents = await this.careerChangeRepository.find({
        relations:['student','idPeriod', 'student.user']
      });

      return {
        statusCode: 200,
        message: this.printMessageLog("Las solicitudes se obtuvieron exitosamente."),
        allRequest: allRequestStundents
      }
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} careerChange`;
  }

  update(id: number, updateCareerChangeDto: UpdateCareerChangeDto) {
    return `This action updates a #${id} careerChange`;
  }

  remove(id: number) {
    return `This action removes a #${id} careerChange`;
  }

  printMessageLog(message){
    this.logger.log(message);
    return message;
  }

  printMessageError(message){
    if(message.response){
      if(message.response.message){
        this.logger.error(message.response.message);
        return message.response;
      }
      this.logger.error(message.response);
      return message.response;
    }
    this.logger.error(message);
    return message;
  }
  

}
