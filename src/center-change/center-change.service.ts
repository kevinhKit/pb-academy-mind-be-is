import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCenterChangeDto } from './dto/create-center-change.dto';
import { UpdateCenterChangeDto } from './dto/update-center-change.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { Repository } from 'typeorm';
import { CenterChange, applicationStatus } from './entities/center-change.entity';
import { CareerChange } from 'src/career-change/entities/career-change.entity';
import { Period } from 'src/period/entities/period.entity';
import { ReviewCenterChangeDto, applicationStatusOption } from './dto/review-center-change.dto';
import { ReviewCareerChangeDto } from 'src/career-change/dto/review-career-change.dto';

@Injectable()
export class CenterChangeService {
  
  private readonly logger = new Logger('centerChangeLogger');

  constructor(
    @InjectRepository(CenterChange) private centerChangeRepository: Repository<CenterChange>,
    @InjectRepository(CareerChange) private careerChangeRepository: Repository<CareerChange>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(StudentCareer) private studentCareerRepository: Repository<StudentCareer>,
    @InjectRepository(CenterCareer) private centerCareerRepository: Repository<CenterCareer>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
  ){
  }

  
  async create({idCenter, justification, justificationPdf, accountNumber, idPeriod}: CreateCenterChangeDto) {
    try {

      const periodExist = await this.periodRepository.findOne({
        where:{
          id: +idPeriod
        }
      });

      if(!periodExist){
        throw new NotFoundException('El periodo proporcionado no existe')
      }

      const centerChangeExist = await this.centerChangeRepository.findOne({
        where:{
          accountNumber: accountNumber,
          applicationStatus: applicationStatus.PROGRESS,
          idPeriod: {
            id: +idPeriod
          },
        },
        relations: ['idPeriod']
      });

      if(centerChangeExist){
        throw new ConflictException('Usted ya realizo una solicitud de cambio de centro regional para el periodo actual')
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

      const requestExist = await this.careerChangeRepository.findOne({
        where: {
          accountNumber: accountNumber,
          applicationStatus: applicationStatus.PROGRESS,
          idPeriod: {
            id: +idPeriod
          }
        }
      });

      if(requestExist){
        throw new ConflictException('Usted tiene un proceso de cambio de carrera actualmente')
      }

      if(studentExist.studentCareer[0].centerCareer.regionalCenter.id == idCenter){
        throw new ConflictException('Usted ya esta inscrito en el centro regional proporcionado')
      }


      const careerCenterExist = await this.centerCareerRepository.findOne({
        where:{
          regionalCenter: {
            id: idCenter
          },
          career: {
            id: studentExist.studentCareer[0].centerCareer.career.id
          }
        }
      });

      if(!careerCenterExist){
        throw new NotFoundException('EL centro regional proporcionado no cuenta con la carrera que estudia actualmente');
      }

      const centerChange = await this.centerChangeRepository.create({
        idCenter: idCenter,
        justification: justification,
        justificationPdf: justificationPdf,
        accountNumber: accountNumber,
        idPeriod: {
          id: +idPeriod
        }
      });

      const savecenterChange = await this.centerChangeRepository.save(centerChange)

      return {
        statusCode: 200,
        message: this.printMessageLog("La solicitud de cambio de centro regional se ha realizado exitosamente."),
        centerChange: savecenterChange
      }


    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async reviewRequest({aplicationStatus, idCenterChange}:ReviewCenterChangeDto){
    try {
      
      const statusAplication = await this.centerChangeRepository.findOne({
        where: {
          idCenterChange: idCenterChange,
          // applicationStatus: In([applicationStatusOption.ACCEPTED,applicationStatusOption.REJECTED])
        }
      });

      if(!statusAplication){
        throw new NotFoundException('Solicitud de cambio de centro regional no encontrada');
      }
      if(statusAplication.applicationStatus == applicationStatusOption.ACCEPTED || statusAplication.applicationStatus == applicationStatusOption.REJECTED ){
        throw new ConflictException('La solicitud del estudiante ya fue revisada');
      }

      const createAplication = await this.centerChangeRepository.preload({
        idCenterChange,
        applicationStatus: aplicationStatus,
        applicationDate: new Date().toISOString()
      });

      const saveAplication = await this.centerChangeRepository.save(createAplication);
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
      const allRequestStundents = await this.centerChangeRepository.find({
        relations:['student','idPeriod','student.user']
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
    return `This action returns a #${id} centerChange`;
  }

  update(id: number, updateCenterChangeDto: UpdateCenterChangeDto) {
    return `This action updates a #${id} centerChange`;
  }

  remove(id: number) {
    return `This action removes a #${id} centerChange`;
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
