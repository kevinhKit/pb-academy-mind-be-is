import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { UpdateTuitionDto } from './dto/update-tuition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from 'src/section/entities/section.entity';
import { Tuition } from './entities/tuition.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Period } from 'src/period/entities/period.entity';
import {
  Rol,
  StatePeriod,
} from 'src/state-period/entities/state-period.entity';
import { Career } from 'src/career/entities/career.entity';

@Injectable()
export class TuitionService {
  private readonly logger = new Logger('tutionLogger');

  constructor(
    @InjectRepository(Section) private sectionRepository: Repository<Section>,
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
    @InjectRepository(StatePeriod)
    private statePeriodRepository: Repository<StatePeriod>,
    @InjectRepository(Career) private careerRepository: Repository<Career>,
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

      const studentsRegistratedWaiting = await this.tuitionRepository.find({
        where: {
          section: { id: `${createTuitionDto.idSection}` },
          waitingList: true,
        },
      });

      const spaceOccupied = studentsRegistrated.length;
      const waitingList = spaceOccupied >= +validSection.space;
      const sectionSpaceOccupied = studentsRegistrated.length + 1;
      const sectionWaitingList = sectionSpaceOccupied >= +validSection.space;

      const waitingSpaceOccupied = studentsRegistratedWaiting.length;
      const canRegistrate = waitingSpaceOccupied === +validSection.waitingSpace;
      if (canRegistrate) {
        throw new NotFoundException('La seccion ya no tiene mas cupos.');
      }

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
          waitingList: false,
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

  async findWaitingSection(id: Section) {
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
          waitingList: true,
        },
        relations: ['student', 'student.user'],
      });

      return {
        message: `Mandando las matriculas en lista de espera de la seccion ${id}`,
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
        throw new NotFoundException('No se ha encontrado al estudiante');
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
            'section.idTeacher.user',
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
            'section.idTeacher.user',
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

  async registration(id: Student) {
    try {
      const studentExist = await this.studentRepository.findOne({
        where: {
          accountNumber: `${id}`,
        },
      });

      if (!studentExist) {
        throw new NotFoundException('No se ha encontrado al estudiante');
      }

      const registrationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.REGISTRATION },
      });

      const period = await this.periodRepository.findOne({
        where: { idStatePeriod: { id: registrationState.id } },
        relations: ['idStatePeriod'],
      });

      if (!period) {
        throw new NotFoundException('No hay ningun periodo en matricula');
      }

      const registrations = await this.tuitionRepository.find({
        where: {
          student: { accountNumber: `${id}` },
          section: { idPeriod: { id: period.id } },
        },
        relations: [
          'section',
          'section.idClass',
          'section.idClassroom',
          'section.idClassroom.idBuilding',
          'section.idTeacher.user',
        ],
      });

      let valueUnits = 25;

      for (const registration of registrations) {
        valueUnits -= +registration.section.idClass.valueUnits;
      }

      return {
        message: `Mandando las matriculas del estudiante ${id}`,
        statusCode: 200,
        valueUnits,
        registrations,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findStudentsPeriod(id: Period, deparmentId: Career) {
    try {
      let careerId = `${deparmentId}`;
      careerId = careerId.toUpperCase();

      const periodExist = await this.periodRepository.findOne({
        where: {
          id: +id,
        },
      });

      if (!periodExist) {
        throw new NotFoundException('EL periodo enviado no existe');
      }

      const careerExist = await this.careerRepository.findOne({
        where: { id: careerId },
      });

      if (!careerExist) {
        throw new NotFoundException('La carrera enviada no existe');
      }

      const registrations = await this.tuitionRepository.find({
        where: {
          section: {
            idPeriod: { id: +id },
            idClass: { departmentId: careerId },
          },
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

  async tuitionValidation(id: Student) {
    try {
      const studentExist = await this.studentRepository.findOne({
        where: {
          accountNumber: `${id}`,
        },
      });

      if (!studentExist) {
        throw new NotFoundException('No se ha encontrado al estudiante');
      }

      const registrationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.REGISTRATION },
      });

      const period = await this.periodRepository.findOne({
        where: { idStatePeriod: { id: registrationState.id } },
        relations: ['idStatePeriod'],
      });

      if (!period) {
        throw new NotFoundException('No hay ningun periodo en matricula');
      }

      const today = this.formatDate(new Date());

      const dayOne = this.formatDate(period.dayOne);
      const dayTwo = this.formatDate(period.dayTwo);
      const dayThree = this.formatDate(period.dayThree);
      const dayFour = this.formatDate(period.dayFour);
      const dayFive = this.formatDate(period.dayFive);

      if (today < dayOne || today > dayFive) {
        throw new NotFoundException('El periodo de matricula ha terminado');
      }

      if (today == dayOne) {
        if (
          studentExist.overallIndex == 0 ||
          studentExist.periodIndex === 0 ||
          studentExist.overallIndex >= 84 ||
          studentExist.periodIndex >= 84
        ) {
        } else {
          throw new NotFoundException(
            'No cumple con el indice para matricular el primer dia',
          );
        }
      }

      if (today == dayTwo) {
        if (
          (studentExist.overallIndex >= 80 && studentExist.overallIndex < 84) ||
          (studentExist.periodIndex >= 80 && studentExist.periodIndex < 84)
        ) {
        } else {
          throw new NotFoundException(
            'No cumple con el indice para matricular el segundo dia',
          );
        }
      }

      if (today == dayThree) {
        if (
          (studentExist.overallIndex >= 73 && studentExist.overallIndex < 80) ||
          (studentExist.periodIndex >= 73 && studentExist.periodIndex < 80)
        ) {
        } else {
          throw new NotFoundException(
            'No cumple con el indice para matricular el tercer dia',
          );
        }
      }

      if (today == dayFour) {
        if (
          (studentExist.overallIndex >= 65 && studentExist.overallIndex < 73) ||
          (studentExist.periodIndex >= 65 && studentExist.periodIndex < 73)
        ) {
        } else {
          throw new NotFoundException(
            'No cumple con el indice para matricular el cuarto dia',
          );
        }
      }

      if (today == dayFive) {
        if (
          (studentExist.overallIndex >= 1 && studentExist.overallIndex < 65) ||
          (studentExist.periodIndex >= 1 && studentExist.periodIndex < 65)
        ) {
        } else {
          throw new NotFoundException(
            'No cumple con el indice para matricular el quinto dia',
          );
        }
      }

      return {
        message: `El estudiante ${id} puede matricular`,
        statusCode: 200,
        period,
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

      const tuitionOnWaiting = JSON.parse(
        validateTuition.waitingList.toString().toLowerCase(),
      );

      await this.tuitionRepository.delete(id);
      if (section && !tuitionOnWaiting) {
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

  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const dayFormated = day < 10 ? `0${day}` : day;
    const monthFormated = month < 10 ? `0${month}` : month;

    return `${year}-${monthFormated}-${dayFormated}`;
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
