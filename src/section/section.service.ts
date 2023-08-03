import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
  ) {}

  async create({
    idClass,
    idPeriod,
    idTeacher,
    space,
    days,
    idClassroom,
    hour,
    finalHour,
  }: CreateSectionDto) {
    try {
      const classExist = await this.classRepository.findOne({
        where: {
          id: +idClass,
        },
      });

      if (!classExist) {
        throw new NotFoundException('No se ha encontrado la clase');
      }

      const periodExist = await this.periodRepository.findOne({
        where: {
          id: +idPeriod,
        },
      });

      if (!periodExist) {
        throw new NotFoundException('EL periodo enviado no existe');
      }

      const classroomExist = await this.classroomRepository.findOne({
        where: {
          id: `${idClassroom}`,
        },
      });

      if (!classroomExist) {
        throw new NotFoundException('El Aula enviada no existe');
      }

      const teacherExist = await this.teacherRepository.findOne({
        where: {
          employeeNumber: `${idTeacher}`,
        },
      });

      if (!teacherExist) {
        throw new NotFoundException('No se ha encontrado al docente');
      }

      const existingSection = await this.sectionRepository.findOne({
        where: {
          idPeriod: idPeriod,
          hour: hour,
          idTeacher: { employeeNumber: `${idTeacher}` },
        },
      });

      if (existingSection) {
        throw new NotFoundException(
          'Ya existe una seccion a esa hora con ese docente.',
        );
      }
      let sectionExist;
      let sectionIterator = 0;
      let finalSectionCode = '';
      do {
        const sectionCode = hour.slice(0, -1) + sectionIterator;
        sectionExist = await this.sectionRepository.findOne({
          where: {
            idPeriod: idPeriod,
            idClass: idClass,
            codeSection: sectionCode,
          },
        });
        sectionIterator++;
        finalSectionCode = sectionCode;
      } while (sectionExist);

      const newSection = await this.sectionRepository.create({
        idPeriod: idPeriod,
        codeSection: finalSectionCode,
        idClass: idClass,
        idTeacher: idTeacher,
        space: space,
        days: days,
        idClassroom: idClassroom,
        hour: hour,
        finalHour: finalHour,
      });

      const saveSection = await this.sectionRepository.save(newSection);

      const savedSectionWithRelations = await this.sectionRepository.findOne({
        where: { id: saveSection.id },
        relations: [
          'idPeriod',
          'idPeriod.idStatePeriod',
          'idClass',
          'idTeacher',
          'idClassroom',
          'idClassroom.idBuilding.idRegionalCenter',
        ],
      });

      return {
        message: 'Se ha creado correctamente la sección',
        statusCode: 200,
        section: savedSectionWithRelations,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const sections = await this.sectionRepository.find({
        relations: [
          'idPeriod',
          'idPeriod.idStatePeriod',
          'idClass',
          'idTeacher',
          'idClassroom',
          'idClassroom.idBuilding.idRegionalCenter',
        ],
      });
      return {
        message: 'Se han devuelto las secciones exitosamente',
        statusCode: 200,
        sections,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findOne(id: string) {
    try {
      const section = await this.sectionRepository.findOne({
        where: { id: id },
        relations: [
          'idPeriod',
          'idPeriod.idStatePeriod',
          'idClass',
          'idTeacher',
          'idClassroom',
          'idClassroom.idBuilding.idRegionalCenter',
        ],
      });
      return {
        message: 'Se ha devuelto la seccion exitosamente',
        statusCode: 200,
        section,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
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
