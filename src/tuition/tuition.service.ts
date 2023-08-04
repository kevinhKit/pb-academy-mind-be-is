import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { UpdateTuitionDto } from './dto/update-tuition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from 'src/section/entities/section.entity';
import { Tuition } from './entities/tuition.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class TuitionService {
  private readonly logger = new Logger('tutionLogger');

  constructor(
    @InjectRepository(Section) private sectionRepository: Repository<Section>,
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async create(createTuitionDto: CreateTuitionDto) {
    try {
      const validSection = await this.sectionRepository.findOne({
        where: { id: `${createTuitionDto.idSection}` },
      });

      if (!validSection) {
        throw new NotFoundException('La seccion enviada no existe');
      }

      const tuitionExist = await this.tuitionRepository.findOne({
        where: {
          section: { id: `${createTuitionDto.idSection}` },
          student: { accountNumber: `${createTuitionDto.idStudent}` },
        },
      });

      if (tuitionExist) {
        throw new NotFoundException(
          'El estudiante ya se encuentra matriculado en esa seccion',
        );
      }

      const studentExist = await this.studentRepository.findOne({
        where: {
          accountNumber: `${createTuitionDto.idStudent}`,
        },
      });

      if (!studentExist) {
        throw new NotFoundException('No se ha encontrado al docente');
      }

      const createdTuition = await this.tuitionRepository.create({
        student: createTuitionDto.idStudent,
        section: createTuitionDto.idSection,
      });

      const savedTuition = await this.tuitionRepository.save(createdTuition);

      const newTuition = await this.tuitionRepository.findOne({
        where: { id: savedTuition.id },
        relations: [
          'student',
          'section',
          'section.idPeriod',
          'section.idPeriod.idStatePeriod',
          'section.idClass',
          'section.idTeacher',
          'section.idClassroom',
          'section.idClassroom.idBuilding.idRegionalCenter',
        ],
      });

      return {
        message: 'Se ha creado correctamente la matricula',
        statusCode: 200,
        registration: newTuition,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const tuitions = await this.tuitionRepository.find({
        relations: [
          'student',
          'section',
          'section.idPeriod',
          'section.idPeriod.idStatePeriod',
          'section.idClass',
          'section.idTeacher',
          'section.idClassroom',
          'section.idClassroom.idBuilding.idRegionalCenter',
        ],
      });
      return {
        message: 'Se han devuelto todas las matriculas correctamente',
        statusCode: 200,
        registration: tuitions,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findOne(id: string) {
    try {
      const tuition = await this.tuitionRepository.findOne({
        where: { id: id },
        relations: [
          'student',
          'section',
          'section.idPeriod',
          'section.idPeriod.idStatePeriod',
          'section.idClass.careerClass.idCareer',
          'section.idTeacher',
          'section.idClassroom',
          'section.idClassroom.idBuilding.idRegionalCenter',
        ],
      });

      if (!tuition) {
        throw new NotFoundException('La matricula no existe.');
      }

      return {
        message: 'Se han devuelto la matricula correctamente',
        statusCode: 200,
        registration: tuition,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  update(id: number, updateTuitionDto: UpdateTuitionDto) {
    return `This action updates a #${id} tuition`;
  }

  async remove(id: string) {
    try {
      const validateTuition = await this.tuitionRepository.findOne({
        where: { id: id },
      });

      if (!validateTuition) {
        throw new NotFoundException('La matricula no existe.');
      }

      await this.tuitionRepository.delete(id);

      return {
        message: 'Se ha eliminado la seccion exitosamente',
        statusCode: 200,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
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
