import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Period } from 'src/period/entities/period.entity';
import { Class } from 'src/class/entities/class.entity';

@Injectable()
export class SectionService {


  private readonly logger = new Logger('sectionLogger');


  constructor(

    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(Section) private sectionRepository: Repository<Section>,
    @InjectRepository(Classroom) private classroomRepository: Repository<Classroom>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
  ) {}

  async create({idClass, codeSection,idPeriod, idTeacher, space, days, idClassroom, hour}: CreateSectionDto) {
    try {
      
      const sectionExist = await this.sectionRepository.findOne({
        where:{
          idPeriod: {
            id: +idPeriod
          },
          codeSection: codeSection,
          idClass: {
            id: +idClass
          },
          idTeacher:{
            employeeNumber: idTeacher
          },
          space: space,
          idClassroom: {
            id: idClassroom
          },
          hour: hour,
          days: days.join('')
        }
      });

      if(sectionExist){
        throw new ConflictException('La sección ya existe actualmente');
      }

      const classExist = await this.classRepository.findOne({
        where:{
          id: +idClass
        }
      });

      if(!classExist){
        throw new NotFoundException('No se ha encontrado la clase');
      }

      const periodExist = await this.periodRepository.findOne({
        where:{
          id: +idPeriod
        }
      });

      if(!periodExist){
        throw new NotFoundException('EL periodo enviado no existe');
      }

      const classroomExist = await this.classRepository.findOne({
        where:{
          id: +idClassroom
        }
      });

      if(!classroomExist){
        throw new NotFoundException('El Aula enviada no existe');
      }

      const teacherExist = await this.teacherRepository.findOne({
        where:{
          employeeNumber: idTeacher
        }
      });

      if(!teacherExist){
        throw new NotFoundException('No se ha encontrado al docente');
      }

      const newSection = await this.sectionRepository.create({
          idPeriod: {
            id: +idPeriod
          },
          codeSection: codeSection,
          idClass: {
            id: +idClass
          },
          idTeacher:{
            employeeNumber: idTeacher
          },
          space: space,
          idClassroom: {
            id: idClassroom
          },
          hour: hour,
          days: days.join('')
      })

      const saveSection = await this.sectionRepository.save(newSection);


      return {
        message: 'Se ha creado correctamente la sección',
        statusCode: 200,
        section: saveSection,
      };

    } catch (error) {
      console.log(error)
      return this.printMessageError(error);
    }
  }

  findAll() {
    return `This action returns all section`;
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }

  printMessageLog(message) {
    this.logger.log(message);
    return message;
  }

  printMessageError(message) {
    if (message.response) {
      if (message.response.message) {
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
