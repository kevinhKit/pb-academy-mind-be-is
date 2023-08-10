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
import { In, Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Period } from 'src/period/entities/period.entity';
import { Class } from 'src/class/entities/class.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import {
  Rol,
  StatePeriod,
} from 'src/state-period/entities/state-period.entity';
import { Career } from 'src/career/entities/career.entity';

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
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
    @InjectRepository(StatePeriod)
    private statePeriodRepository: Repository<StatePeriod>,
    @InjectRepository(Career) private careerRepository: Repository<Career>,
  ) {}

  async create({
    idClass,
    idPeriod,
    idTeacher,
    space,
    waitingSpace,
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

      const planificationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.PLANIFICATION },
      });

      const registrationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.REGISTRATION },
      });

      const periodExist = await this.periodRepository.findOne({
        where: {
          id: +idPeriod,
          idStatePeriod: In([planificationState.id, registrationState.id]),
        },
      });

      if (!periodExist) {
        throw new NotFoundException(
          'EL periodo enviado no existe o no se encuentra en planificacion o matricula',
        );
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
          idPeriod: { id: +idPeriod },
          hour: hour,
          idTeacher: { employeeNumber: `${idTeacher}` },
        },
      });

      if (existingSection) {
        throw new NotFoundException(
          'Ya existe una seccion a esa hora con ese docente.',
        );
      }

      const classRoomOccupied = await this.sectionRepository.findOne({
        where: {
          idPeriod: { id: +idPeriod },
          hour: hour,
          idClassroom: { id: `${idClassroom}` },
        },
      });

      if (classRoomOccupied) {
        throw new NotFoundException(
          'Ya existe una seccion a esa hora en esa aula.',
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
        waitingSpace: waitingSpace,
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

  async findSectionsByDepartment(id: Career) {
    try {
      const newId = `${id}`;
      const idCareer = newId.toUpperCase();
      const existingCareer = await this.careerRepository.findOne({
        where: { id: idCareer },
      });

      if (!existingCareer) {
        throw new NotFoundException('La carrera no existe.');
      }

      const planificationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.PLANIFICATION },
      });

      const registrationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.REGISTRATION },
      });

      const periodExist = await this.periodRepository.findOne({
        where: {
          idStatePeriod: In([planificationState.id, registrationState.id]),
        },
      });

      if (!periodExist) {
        throw new NotFoundException(
          'No existe un periodo en matricula o planificacion',
        );
      }

      const sections = await this.sectionRepository.find({
        where: { idClass: { departmentId: idCareer } },
        relations: [
          'idPeriod',
          'idPeriod.idStatePeriod',
          'idClass',
          'idTeacher',
          'idClassroom',
          'idClassroom.idBuilding.idRegionalCenter',
        ],
        order: { waitingList: 'ASC' },
      });

      for (const section of sections) {
        const sectionRegistrations = await this.tuitionRepository.find({
          where: {
            section: { id: section.id },
            waitingList: false,
          },
        });

        const sectionRegistrationsWaiting = await this.tuitionRepository.find({
          where: {
            section: { id: section.id },
            waitingList: true,
          },
        });

        let spaces;
        let waitingSpaces;
        if (sectionRegistrations.length == 0) {
          spaces = section.space;
        } else {
          spaces = +section.space - sectionRegistrations.length;
        }
        if (sectionRegistrationsWaiting.length == 0) {
          waitingSpaces = section.waitingSpace;
        } else {
          waitingSpaces =
            +section.waitingSpace - sectionRegistrationsWaiting.length;
        }

        section['availableSpaces'] = spaces;
        if (JSON.parse(section.waitingList.toString().toLowerCase())) {
          section['waitingAvailableSpaces'] = waitingSpaces;
        }
      }

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

      if (!section) {
        throw new NotFoundException('La seccion no existe.');
      }

      return {
        message: 'Se ha devuelto la seccion exitosamente',
        statusCode: 200,
        section,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findTeacher(id: Teacher, periodId: Period) {
    try {
      let periodExist = null;
      let teacherSections;

      const teacherExist = await this.teacherRepository.findOne({
        where: {
          employeeNumber: `${id}`,
        },
      });

      if (!teacherExist) {
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
        teacherSections = await this.sectionRepository.find({
          where: { idTeacher: { employeeNumber: `${id}` } },
          relations: [
            'idPeriod',
            'idPeriod.idStatePeriod',
            'idClass',
            'idTeacher',
            'idClassroom',
            'idClassroom.idBuilding.idRegionalCenter',
          ],
        });
      } else {
        teacherSections = await this.sectionRepository.find({
          where: {
            idTeacher: { employeeNumber: `${id}` },
            idPeriod: { id: +periodId },
          },
          relations: [
            'idPeriod',
            'idPeriod.idStatePeriod',
            'idClass',
            'idTeacher',
            'idClassroom',
            'idClassroom.idBuilding.idRegionalCenter',
          ],
        });
      }

      return {
        message: `Se han devuelto las secciones del docente ${id}`,
        statusCode: 200,
        section: teacherSections,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findTeacherGrades(id: Teacher) {
    try {
      const teacherExist = await this.teacherRepository.findOne({
        where: {
          employeeNumber: `${id}`,
        },
      });

      if (!teacherExist) {
        throw new NotFoundException('No se ha encontrado al docente');
      }

      const gradesState = await this.statePeriodRepository.findOne({
        where: { name: Rol.GRADES },
      });

      const periodOnGrades = await this.periodRepository.findOne({
        where: { idStatePeriod: { id: gradesState.id } },
      });

      if (!periodOnGrades) {
        throw new NotFoundException(
          'No hay ningun periodo en ingreso de calificaciones',
        );
      }

      const teacherSections = await this.sectionRepository.find({
        where: {
          idTeacher: { employeeNumber: `${id}` },
          idPeriod: { id: periodOnGrades.id },
        },
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
        message: `Se han devuelto las secciones en ingreso de notas del docente ${id}`,
        statusCode: 200,
        section: teacherSections,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findClasses(classId: Class, periodId: Period) {
    try {
      const classExist = await this.classRepository.findOne({
        where: {
          id: +classId,
        },
      });

      if (!classExist) {
        throw new NotFoundException('No se ha encontrado la clase');
      }

      const periodExist = await this.periodRepository.findOne({
        where: {
          id: +periodId,
        },
      });

      if (!periodExist) {
        throw new NotFoundException('EL periodo enviado no existe');
      }

      const classesSections = await this.sectionRepository.find({
        where: {
          idPeriod: { id: +periodId },
          idClass: { id: +classId },
        },
        relations: [
          'idPeriod',
          'idPeriod.idStatePeriod',
          'idClass',
          'idTeacher',
          'idClassroom',
          'idClassroom.idBuilding.idRegionalCenter',
        ],
      });

      for (const section of classesSections) {
        const sectionRegistrations = await this.tuitionRepository.find({
          where: {
            section: { id: section.id },
            waitingList: false,
          },
        });

        const sectionRegistrationsWaiting = await this.tuitionRepository.find({
          where: {
            section: { id: section.id },
            waitingList: true,
          },
        });

        let spaces;
        let waitingSpaces;
        if (sectionRegistrations.length == 0) {
          spaces = section.space;
        } else {
          spaces = +section.space - sectionRegistrations.length;
        }
        if (sectionRegistrationsWaiting.length == 0) {
          waitingSpaces = section.waitingSpace;
        } else {
          waitingSpaces =
            +section.waitingSpace - sectionRegistrationsWaiting.length;
        }

        section['availableSpaces'] = spaces;
        if (JSON.parse(section.waitingList.toString().toLowerCase())) {
          section['waitingAvailableSpaces'] = waitingSpaces;
        }
      }

      return {
        message: `Se han devuelto las secciones de la clase ${classId} en el periodo ${periodId}`,
        statusCode: 200,
        sections: classesSections,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findWaitingListSections(id: Career) {
    try {
      const newId = `${id}`;
      const idCareer = newId.toUpperCase();
      const existingCareer = await this.careerRepository.findOne({
        where: { id: idCareer },
      });

      if (!existingCareer) {
        throw new NotFoundException('La carrera no existe.');
      }

      const registrationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.REGISTRATION },
      });

      const period = await this.periodRepository.findOne({
        where: {
          idStatePeriod: In([registrationState.id]),
        },
        relations: ['idStatePeriod'],
      });

      if (!period) {
        throw new NotFoundException('No existe ningun periodo en matricula.');
      }

      const waitingListSections = await this.sectionRepository.find({
        where: {
          idPeriod: { id: period.id },
          waitingList: true,
          idClass: { departmentId: idCareer },
        },
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
        message: `Todas las secciones en lista de espera ed un departamento`,
        statusCode: 200,
        waitingListSections,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    try {
      let teacher;
      let classRoom;

      const section = await this.sectionRepository.findOne({
        where: { id: id },
      });

      if (!section) {
        throw new NotFoundException('La seccion no existe.');
      }

      if (updateSectionDto.idTeacher) {
        teacher = await this.teacherRepository.findOne({
          where: {
            employeeNumber: `${updateSectionDto.idTeacher}`,
          },
        });

        if (!teacher) {
          throw new NotFoundException('El docente no existe.');
        }
      }

      if (updateSectionDto.idClassroom) {
        classRoom = await this.classroomRepository.findOne({
          where: {
            id: `${updateSectionDto.idClassroom}`,
          },
        });

        if (!classRoom) {
          throw new NotFoundException('El Aula enviada no existe');
        }
      }

      if (+updateSectionDto.space < +section.space) {
        throw new NotFoundException(
          'No se pueden reducir la cantidad de cupos de la seccion',
        );
      }

      if (updateSectionDto.hour) {
        let sectionExist;
        let sectionIterator = 0;
        let finalSectionCode = '';
        do {
          const sectionCode =
            updateSectionDto.hour.slice(0, -1) + sectionIterator;
          sectionExist = await this.sectionRepository.findOne({
            where: {
              idPeriod: section.idPeriod,
              idClass: section.idClass,
              codeSection: sectionCode,
            },
          });
          sectionIterator++;
          finalSectionCode = sectionCode;
        } while (sectionExist);

        section.codeSection = finalSectionCode;
      }

      if (updateSectionDto.idTeacher) {
        section.idTeacher = updateSectionDto.idTeacher;
      }

      if (updateSectionDto.space) {
        const newSpaces = +updateSectionDto.space - +section.space;
        section.space = updateSectionDto.space;
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
        }
        if (registrationOnWaiting.length > newSpaces) {
          section.waitingList = true;
        }
        if (registrationOnWaiting.length < newSpaces) {
          section.waitingList = false;
        }
      }

      if (updateSectionDto.hour) {
        section.hour = updateSectionDto.hour;
      }

      if (updateSectionDto.finalHour) {
        section.finalHour = updateSectionDto.finalHour;
      }

      if (updateSectionDto.idClassroom) {
        section.idClassroom = updateSectionDto.idClassroom;
      }

      if (updateSectionDto.days) {
        section.days = updateSectionDto.days;
      }

      const savedSection = await this.sectionRepository.save(section);

      const updatedSection = await this.sectionRepository.findOne({
        where: { id: savedSection.id },
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
        message: 'Se ha actualizado la seccion exitosamente',
        statusCode: 200,
        section: updatedSection,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async remove(id: string) {
    const validateSection = await this.sectionRepository.findOne({
      where: { id: id },
    });

    if (!validateSection) {
      throw new NotFoundException('La seccion no existe.');
    }

    await this.sectionRepository.delete(id);

    return {
      message: 'Se ha eliminado la seccion exitosamente',
      statusCode: 200,
    };
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
