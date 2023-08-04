import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { UpdateTuitionDto } from './dto/update-tuition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from 'src/section/entities/section.entity';
import { Tuition } from './entities/tuition.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Period } from 'src/period/entities/period.entity';

@Injectable()
export class TuitionService {
  private readonly logger = new Logger('tutionLogger');

  constructor(
    @InjectRepository(Section) private sectionRepository: Repository<Section>,
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
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

      const studentsRegistrated = await this.tuitionRepository.find({
        where: {
          section: { id: `${createTuitionDto.idSection}` },
        },
      });

      const spaceOccupied = studentsRegistrated.length;
      const waitingList = spaceOccupied >= +validSection.space;
      const sectionSpaceOccupied = studentsRegistrated.length + 1;
      const sectionWaitingList = sectionSpaceOccupied >= +validSection.space;

      const createdTuition = await this.tuitionRepository.create({
        student: createTuitionDto.idStudent,
        section: createTuitionDto.idSection,
        waitingList: waitingList,
      });

      if (sectionWaitingList) {
        validSection.waitingList = sectionWaitingList;
        await this.sectionRepository.save(validSection);
      }

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

  async findSection(id: Section) {
    try {
      const validSection = await this.sectionRepository.findOne({
        where: { id: `${id}` },
      });

      if (!validSection) {
        throw new NotFoundException('La seccion enviada no existe');
      }

      const registration = await this.tuitionRepository.find({
        where: {
          section: { id: `${id}` },
        },
        relations: ['student', 'student.user'],
      });

      return {
        message: `Mandando las matriculas de la seccion ${id}`,
        statusCode: 200,
        registration,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findStudent(id: Student, periodId: Period) {
    try {
      let periodExist = null;
      let registrations;
      const studentExist = await this.studentRepository.findOne({
        where: {
          accountNumber: `${id}`,
        },
      });

      if (!studentExist) {
        throw new NotFoundException('No se ha encontrado al docente');
      }

      if (periodId) {
        periodExist = await this.periodRepository.findOne({
          where: {
            id: +periodId,
          },
        });

        if (!periodExist) {
          throw new NotFoundException('EL periodo enviado no existe');
        }
      }

      if (periodExist === null) {
        registrations = await this.tuitionRepository.find({
          where: {
            student: { accountNumber: `${id}` },
          },
          relations: [
            'section',
            'section.idClass',
            'section.idClassroom',
            'section.idClassroom.idBuilding',
          ],
        });
      } else {
        registrations = await this.tuitionRepository.find({
          where: {
            student: { accountNumber: `${id}` },
            section: { idPeriod: { id: +periodId } },
          },
          relations: [
            'section',
            'section.idClass',
            'section.idClassroom',
            'section.idClassroom.idBuilding',
          ],
        });
      }

      return {
        message: `Mandando las matriculas del estudiante ${id}`,
        statusCode: 200,
        registrations,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findStudentsPeriod(id: Period) {
    try {
      const periodExist = await this.periodRepository.findOne({
        where: {
          id: +id,
        },
      });

      if (!periodExist) {
        throw new NotFoundException('EL periodo enviado no existe');
      }

      const registrations = await this.tuitionRepository.find({
        where: {
          section: { idPeriod: { id: +id } },
        },
        relations: ['student', 'student.user'],
      });
      const distinctRegistrations = registrations.reduce(
        (uniqueRegistrations, currentRegistration) => {
          if (
            !uniqueRegistrations.some(
              (reg) =>
                reg.student.accountNumber ===
                currentRegistration.student.accountNumber,
            )
          ) {
            uniqueRegistrations.push(currentRegistration);
          }
          return uniqueRegistrations;
        },
        [],
      );
      return {
        message: `Mandando las matriculas de todos los estudiantes del periodo ${id}`,
        statusCode: 200,
        registrations: distinctRegistrations,
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
        relations: ['section'],
      });

      if (!validateTuition) {
        throw new NotFoundException('La matricula no existe.');
      }

      const section = await this.sectionRepository.findOne({
        where: { id: `${validateTuition.section.id}`, waitingList: true },
      });

      await this.tuitionRepository.delete(id);
      if (section) {
        const newSpaces = 1;
        const registrationOnWaiting = await this.tuitionRepository.find({
          where: {
            section: { id: section.id },
            waitingList: true,
          },
          order: {
            create_at: 'ASC',
          },
        });

        if (registrationOnWaiting.length > 0) {
          const newTuitions = registrationOnWaiting.slice(0, newSpaces);
          newTuitions.forEach(async (tuition: Tuition) => {
            const newTuition = await this.tuitionRepository.findOne({
              where: { id: tuition.id },
            });
            newTuition.waitingList = false;
            await this.tuitionRepository.save(newTuition);
          });
        } else {
          section.waitingList = false;
          await this.sectionRepository.save(section);
        }
      }

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
