import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCenterChangeDto } from './dto/create-center-change.dto';
import { UpdateCenterChangeDto } from './dto/update-center-change.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { Repository } from 'typeorm';
import { CenterChange, applicationStatus } from './entities/center-change.entity';

@Injectable()
export class CenterChangeService {
  
  private readonly logger = new Logger('centerChangeLogger');

  constructor(
    @InjectRepository(CenterChange) private centerChangeRepository: Repository<CenterChange>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(StudentCareer) private studentCareerRepository: Repository<StudentCareer>,
    @InjectRepository(CenterCareer) private centerCareerRepository: Repository<CenterCareer>,
  ){
  }

  
  async create({idCenter, justification, justificationPdf, accountNumber}: CreateCenterChangeDto) {
    try {

      const centerChangeExist = await this.centerChangeRepository.findOne({
        where:{
          accountNumber: accountNumber,
          applicationStatus: applicationStatus.PROGRESS
        }
      });

      if(centerChangeExist){
        throw new ConflictException('Usted ya tiene una solicitud de cambio de centro regional actualmente.')
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
        accountNumber: accountNumber
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

  findAll() {
    return `This action returns all centerChange`;
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
