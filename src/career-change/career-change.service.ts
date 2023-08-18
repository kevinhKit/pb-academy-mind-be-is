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


  async create({idCareer, justification,  accountNumber , idPeriod}: CreateCareerChangeDto) {
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
          },
          stateRequest: true
        },
        relations: ['idPeriod']
      });

      if(careerChangeExist){
        throw new ConflictException('Usted tiene una solicitud de cambio de carrera vigente para el periodo actual.')
      }

      const careerChangePeriodExist = await this.careerChangeRepository.findOne({
        where:{
          accountNumber: accountNumber,
          idPeriod: {
            id: +idPeriod
          },
          stateRequest: true
        },
        relations: ['idPeriod']
      });

      if(careerChangePeriodExist){
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
          // applicationStatus: applicationStatus.PROGRESS,
          idPeriod: {
            id: +idPeriod
          },
          stateRequest: true
        },
        relations: ['idPeriod']
      });

      if(requestExist){
        throw new ConflictException('Usted ya tiene un proceso de cambio de centro regional para el periodo actual')
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
        // justificationPdf: justificationPdf,
        accountNumber: accountNumber,
        idPeriod: {
          id: +idPeriod
        },
        stateRequest: true
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
          stateRequest: true,
        },
        relations: ['student','student.studentCareer','student.studentCareer.centerCareer','student.studentCareer.centerCareer.career','student.studentCareer.centerCareer.regionalCenter']
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

      if(aplicationStatus == applicationStatusOption.ACCEPTED){

        const studentChange = await JSON.parse(JSON.stringify(statusAplication));

        const oldCenterCareer = await this.centerCareerRepository.findOne({
          where: {
            career: {
              id: studentChange.student.studentCareer[0].centerCareer.career.id
            },
            regionalCenter: {
              id: studentChange.student.studentCareer[0].centerCareer.regionalCenter.id
            }
          }
        });

        

        const centerCareer = await this.centerCareerRepository.findOne({
          where: {
            career: {
              id: studentChange.idCareer
            },
            regionalCenter: {
              id: studentChange.student.studentCareer[0].centerCareer.regionalCenter.id
            }
          }
        });

        const studentCarrer = await this.studentCareerRepository.findOne({
          where: {
            student: {
              accountNumber: studentChange.student.accountNumber
            }
          }
        });

        
        const newStudentCareer = await this.studentCareerRepository.preload({
          idStudentCareer: studentCarrer.idStudentCareer,
          // student: 
          //   studentChange.student.accountNumber
          // ,
          centerCareer: {
            idCenterCareer: centerCareer.idCenterCareer
          }
        });

        console.log(newStudentCareer)
  
        await this.studentCareerRepository.save(newStudentCareer);
      }

      const saveAplication = await this.careerChangeRepository.save(createAplication);
      return {
        statusCode: 200,
        message: this.printMessageLog("La solicitud del estudiante se actualizo con exito."),
        aplicationRequest: saveAplication
      }
    } catch (error) {
      console.log(error)
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const allRequestStundents = await this.careerChangeRepository.find({
        relations:['student','idPeriod', 'student.user'],
        where: {
          stateRequest: true
        }
      });

      if(allRequestStundents.length == 0){
        throw new NotFoundException('No se han encontrado solicitudes');
      }

      return {
        statusCode: 200,
        message: this.printMessageLog("Las solicitudes se obtuvieron exitosamente."),
        allRequest: allRequestStundents
      }
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAllByStudent(id: string) {
    try {
      const allRequestStundents = await this.careerChangeRepository.find({
        relations:['student','idPeriod', 'student.user','student.studentCareer.centerCareer','student.studentCareer.centerCareer.career','student.studentCareer.centerCareer.regionalCenter'],
        where: {
          student:{
            accountNumber: id
          },
          stateRequest: true
        },
      });

      if(allRequestStundents.length == 0){
        throw new NotFoundException('No se han encontrado solicitudes');
      }

      return {
        statusCode: 200,
        message: this.printMessageLog("Las solicitudes se obtuvieron exitosamente."),
        allRequest: allRequestStundents
      }
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findOne(center: string, id: string) {
    try {
      const allRequestStundents = await this.careerChangeRepository.find({
        relations:['student','idPeriod', 'student.user','student.studentCareer.centerCareer','student.studentCareer.centerCareer.career','student.studentCareer.centerCareer.regionalCenter'],
        where: {
          idCareer: id,
          student:{
            studentCareer: {
              centerCareer: {
                regionalCenter: {
                  id: center.toUpperCase()
                }
              }
            }
          },
          stateRequest: true
        },
      });

      if(allRequestStundents.length == 0){
        throw new NotFoundException('No se han encontrado solicitudes');
      }

      return {
        statusCode: 200,
        message: this.printMessageLog("Las solicitudes se obtuvieron exitosamente."),
        allRequest: allRequestStundents
      }
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  update(id: number, updateCareerChangeDto: UpdateCareerChangeDto) {
    return `This action updates a #${id} careerChange`;
  }

  async remove(id: string) {
    try {

      const careerChangeDelete = await this.careerChangeRepository.findOne({
        where: {
          idCareerChange: id,
          stateRequest: false
        }
      });

      if(careerChangeDelete){
        throw new NotFoundException('La Solicitud ya ha sido borrada');
      }
      
      const careerChangeExist = await this.careerChangeRepository.findOne({
        where: {
          idCareerChange: id,
          stateRequest: true
        }
      });

      if(!careerChangeExist){
        throw new NotFoundException('Solicitud no encontrada');
      }

      const careerChange = await this.careerChangeRepository.preload({
        idCareerChange:id,
        stateRequest: false
      });

      await this.careerChangeRepository.save(careerChange);


      return {
        statusCode: 200,
        message: this.printMessageLog("La solicitud se ha borrado exitosamente"),
      }


    } catch (error) {
      return this.printMessageError(error);
    }
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
