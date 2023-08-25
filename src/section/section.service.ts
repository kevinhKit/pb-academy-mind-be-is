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
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { Student } from 'src/student/entities/student.entity';
import { SendEmailService } from 'src/shared/send-email/send-email.service';

@Injectable()
export class SectionService {
  private readonly logger = new Logger('sectionLogger');

  constructor(
    private readonly sendEmailService: SendEmailService,

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
    @InjectRepository(RegionalCenter)
    private regionalCenterRepository: Repository<RegionalCenter>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
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

      const sections = await this.sectionRepository.find({
        where: {
          idPeriod: { id: +idPeriod },
          idTeacher: { employeeNumber: `${idTeacher}` },
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

      const sectionAlreadyExists = await this.validateExistingSection(
        sections,
        hour,
        finalHour,
      );

      if (existingSection || sectionAlreadyExists) {
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

      const classRoomSections = await this.sectionRepository.find({
        where: {
          idPeriod: { id: +idPeriod },
          idClassroom: { id: `${idClassroom}` },
        },
      });

      const classRoomAlreadyOccupied = await this.validateExistingSection(
        classRoomSections,
        hour,
        finalHour,
      );

      if (classRoomOccupied || classRoomAlreadyOccupied) {
        throw new NotFoundException(
          'Ya existe una seccion a esa hora en esa aula.',
        );
      }

      let sectionExist;
      let sectionIterator = 0;
      let finalSectionCode = '';
      do {
        const sectionCode =
          hour.replace(':', '').slice(0, -1) + sectionIterator;
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

  async findSectionsByDepartment(id: Career, centerId: RegionalCenter) {
    try {
      const newId = `${id}`;
      const idCareer = newId.toUpperCase();
      let idCenter = `${centerId}`;
      idCenter = idCenter.toUpperCase();
      const existingCareer = await this.careerRepository.findOne({
        where: { id: idCareer },
      });

      if (!existingCareer) {
        throw new NotFoundException('La carrera no existe.');
      }

      const existingCenter = await this.regionalCenterRepository.findOne({
        where: { id: idCenter },
      });

      if (!existingCenter) {
        throw new NotFoundException('El centro regional no existe.');
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
        where: {
          idClass: { departmentId: idCareer },
          idPeriod: { id: periodExist.id },
          idClassroom: { idBuilding: { idRegionalCenter: { id: idCenter } } },
        },
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
        message: `Se han devuelto las secciones del departamento ${id} y el centro ${centerId} exitosamente`,
        statusCode: 200,
        sections,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findSectionsOnGrades(id: Career, centerId: RegionalCenter) {
    try {
      const newId = `${id}`;
      const idCareer = newId.toUpperCase();
      let idCenter = `${centerId}`;
      idCenter = idCenter.toUpperCase();
      const existingCareer = await this.careerRepository.findOne({
        where: { id: idCareer },
      });

      if (!existingCareer) {
        throw new NotFoundException('La carrera no existe.');
      }

      const existingCenter = await this.regionalCenterRepository.findOne({
        where: { id: idCenter },
      });

      if (!existingCenter) {
        throw new NotFoundException('El centro regional no existe.');
      }

      const gradesState = await this.statePeriodRepository.findOne({
        where: { name: Rol.GRADES },
      });

      const periodExist = await this.periodRepository.findOne({
        where: {
          idStatePeriod: In([gradesState.id]),
        },
      });

      if (!periodExist) {
        throw new NotFoundException(
          'El periodo de ingreso de notas no esta activo',
        );
      }

      const sections = await this.sectionRepository.find({
        where: {
          idClass: { departmentId: idCareer },
          idPeriod: { id: periodExist.id },
          idClassroom: { idBuilding: { idRegionalCenter: { id: idCenter } } },
        },
        relations: [
          'idPeriod',
          'idPeriod.idStatePeriod',
          'idClass',
          'idTeacher.user',
          'idClassroom',
          'idClassroom.idBuilding.idRegionalCenter',
        ],
      });

      return {
        message: `Se han devuelto las secciones del departamento ${id} y el centro ${centerId} exitosamente`,
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
          'idTeacher.teachingCareer.centerCareer.career',
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

  async findClasses(
    classId: Class,
    periodId: Period,
    centerId: RegionalCenter,
  ) {
    try {
      let idCenter = `${centerId}`;
      idCenter = idCenter.toUpperCase();

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

      const existingCenter = await this.regionalCenterRepository.findOne({
        where: { id: idCenter },
      });

      if (!existingCenter) {
        throw new NotFoundException('El centro regional no existe.');
      }

      const classesSections = await this.sectionRepository.find({
        where: {
          idPeriod: { id: +periodId },
          idClass: { id: +classId },
          idClassroom: { idBuilding: { idRegionalCenter: { id: idCenter } } },
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
        message: `Se han devuelto las secciones de la clase ${classId} en el periodo ${periodId} del centro ${idCenter}`,
        statusCode: 200,
        sections: classesSections,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findWaitingListSections(id: Career, centerId: RegionalCenter) {
    try {
      const newId = `${id}`;
      const idCareer = newId.toUpperCase();
      const existingCareer = await this.careerRepository.findOne({
        where: { id: idCareer },
      });

      if (!existingCareer) {
        throw new NotFoundException('La carrera no existe.');
      }

      let idCenter = `${centerId}`;
      idCenter = idCenter.toUpperCase();

      const existingCenter = await this.regionalCenterRepository.findOne({
        where: { id: idCenter },
      });

      if (!existingCenter) {
        throw new NotFoundException('El centro regional no existe.');
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
          idClassroom: { idBuilding: { idRegionalCenter: { id: idCenter } } },
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

  async findPeriodCharge(
    id: Career,
    centerId: RegionalCenter,
    periodId: Period,
  ) {
    try {
      const newId = `${id}`;
      const idCareer = newId.toUpperCase();
      const existingCareer = await this.careerRepository.findOne({
        where: { id: idCareer },
      });

      if (!existingCareer) {
        throw new NotFoundException('La carrera no existe.');
      }

      let idCenter = `${centerId}`;
      idCenter = idCenter.toUpperCase();

      const existingCenter = await this.regionalCenterRepository.findOne({
        where: { id: idCenter },
      });

      if (!existingCenter) {
        throw new NotFoundException('El centro regional no existe.');
      }

      const periodExist = await this.periodRepository.findOne({
        where: { id: +periodId },
      });

      if (!periodExist) {
        throw new NotFoundException('El periodo enviado no existe.');
      }

      const academicCharge = await this.sectionRepository.find({
        relations: [
          'idPeriod',
          'idClass',
          'idTeacher.user',
          'idClassroom.idBuilding.idRegionalCenter',
        ],
        where: {
          idClassroom: { idBuilding: { idRegionalCenter: { id: idCenter } } },
          idClass: { departmentId: idCareer },
          idPeriod: { id: periodExist.id },
        },
      });

      for (const section of academicCharge) {
        const sectionRegistrations = await this.tuitionRepository.find({
          where: {
            section: { id: section.id },
            waitingList: false,
          },
        });

        let spaces;
        if (sectionRegistrations.length == 0) {
          spaces = 0;
        } else {
          spaces = sectionRegistrations.length;
        }

        section['studentsRegistered'] = spaces;
      }

      return {
        message: `Se ha devuelto la carga academica del periodo`,
        statusCode: 200,
        academicCharge,
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

      if (updateSectionDto.idTeacher) {
        teacher = await this.teacherRepository.findOne({
          where: {
            employeeNumber: `${updateSectionDto.idTeacher}`,
          },
        });

        if (!teacher) {
          throw new NotFoundException('El docente no existe.');
        }

        const existingSection = await this.sectionRepository.findOne({
          where: {
            idPeriod: { id: section.idPeriod.id },
            hour: section.hour,
            idTeacher: {
              employeeNumber: `${updateSectionDto.idTeacher}`,
            },
          },
        });

        const sections = await this.sectionRepository.find({
          where: {
            idPeriod: { id: section.idPeriod.id },
            idTeacher: {
              employeeNumber: `${updateSectionDto.idTeacher}`,
            },
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

        const sectionAlreadyExists = await this.validateExistingSection(
          sections,
          section.hour,
          section.finalHour,
        );

        if (existingSection || sectionAlreadyExists) {
          throw new NotFoundException(
            'Ya existe una seccion a esa hora con ese docente.',
          );
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

  async sendFriendRequest(emisorId: Student, receptorId: Student) {
    const sender = await this.studentRepository.findOne({
      where: { accountNumber: `${emisorId}` },
    });

    const recipient = await this.studentRepository.findOne({
      where: { accountNumber: `${receptorId}` },
    });

    await this.sendEmailService.sendRequestContact(sender, recipient);
  }

  async validateExistingSection(
    sections: Section[],
    hour: string,
    finalHour: string,
  ) {
    for (const existingSection of sections) {
      if (
        this.horasSeccionesTraslapan(
          existingSection.hour,
          hour,
          existingSection.finalHour,
          finalHour,
        )
      ) {
        return true; // Existe traslape
      }
    }

    return false; // No existe traslape
  }

  horasSeccionesTraslapan(
    startHour1: string,
    startHour2: string,
    finalHour1: string,
    finalHour2: string,
  ): boolean {
    const [startHour1Num, startMinute1Num] = startHour1.split(':').map(Number);
    const [endHour1Num, endMinute1Num] = finalHour1.split(':').map(Number);
    const [startHour2Num, startMinute2Num] = startHour2.split(':').map(Number);
    const [endHour2Num, endMinute2Num] = finalHour2.split(':').map(Number);

    const startTotalMinutes1 = startHour1Num * 60 + startMinute1Num;
    const endTotalMinutes1 = endHour1Num * 60 + endMinute1Num;
    const startTotalMinutes2 = startHour2Num * 60 + startMinute2Num;
    const endTotalMinutes2 = endHour2Num * 60 + endMinute2Num;

    // Comprobar si hay traslape
    return (
      startTotalMinutes1 <= endTotalMinutes2 &&
      startTotalMinutes2 <= endTotalMinutes1
    );
  }

  parseHoras(startHour: string, endHour: string): [number, number] {
    const [startHourNum, startMinuteNum] = startHour.split(':').map(Number);
    const [endHourNum, endMinuteNum] = endHour.split(':').map(Number);

    const startTotalMinutes = startHourNum * 60 + startMinuteNum;
    const endTotalMinutes = endHourNum * 60 + endMinuteNum;

    return [startTotalMinutes, endTotalMinutes];
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
