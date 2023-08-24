import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { In, Not, Repository } from 'typeorm';
import {
  Rol,
  StatePeriod,
} from 'src/state-period/entities/state-period.entity';
import { UpdatePeriodCancelationDto } from './dto/update-period-cancelation.dt';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class PeriodService {
  private readonly logger = new Logger('periodLogger');

  constructor(
    @InjectRepository(Period)
    private periodRepository: Repository<Period>,
    @InjectRepository(StatePeriod)
    private statePeriodRepository: Repository<StatePeriod>,
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async create(createPeriodDto: CreatePeriodDto) {
    try {
      const statePeriod = await this.statePeriodRepository.findOne({
        where: { id: createPeriodDto.idStatePeriod.id },
      });

      if (!statePeriod) {
        throw new NotFoundException(
          'El Estado del periodo proporcionado no fue encontrado',
        );
      }

      const planificationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.PLANIFICATION },
      });

      const registrationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.REGISTRATION },
      });

      const ongoingState = await this.statePeriodRepository.findOne({
        where: { name: Rol.ONGOING },
      });

      const gradesState = await this.statePeriodRepository.findOne({
        where: { name: Rol.GRADES },
      });

      if (+createPeriodDto.idStatePeriod == planificationState.id) {
        const existingPeriodsOnPlanification = await this.periodRepository.find(
          {
            where: { idStatePeriod: { id: planificationState.id } },
          },
        );

        if (existingPeriodsOnPlanification.length > 0) {
          throw new NotFoundException(
            'Ya existe un periodo en estado de Planificacion',
          );
        }
      }

      if (+createPeriodDto.idStatePeriod == registrationState.id) {
        const existingPeriodsOnRegistration = await this.periodRepository.find({
          where: { idStatePeriod: { id: registrationState.id } },
        });

        if (existingPeriodsOnRegistration.length > 0) {
          throw new NotFoundException(
            'Ya existe un periodo en estado de Matricula',
          );
        }
      }

      if (+createPeriodDto.idStatePeriod == ongoingState.id) {
        const existingPeriodsOngoing = await this.periodRepository.find({
          where: { idStatePeriod: { id: ongoingState.id } },
        });

        if (existingPeriodsOngoing.length > 0) {
          throw new NotFoundException(
            'Ya existe un periodo en estado En Curso',
          );
        }
      }

      if (+createPeriodDto.idStatePeriod == gradesState.id) {
        const existingPeriodsOnGrades = await this.periodRepository.find({
          where: { idStatePeriod: { id: gradesState.id } },
        });

        if (existingPeriodsOnGrades.length > 0) {
          throw new NotFoundException(
            'Ya existe un periodo en estado en Ingreso de notas',
          );
        }
      }

      const periodAlreadyExits = await this.periodRepository.findOne({
        where: {
          year: createPeriodDto.year,
          numberPeriod: createPeriodDto.numberPeriod,
        },
      });

      if (periodAlreadyExits) {
        throw new NotFoundException('El periodo ya existe.');
      }

      const period = await this.periodRepository.create({
        idStatePeriod: createPeriodDto.idStatePeriod,
        numberPeriod: createPeriodDto.numberPeriod,
        replacementPaymentDate: createPeriodDto.replacementPaymentDate,
        exceptionalCancellationDate:
          createPeriodDto.exceptionalCancellationDate,
        year: createPeriodDto.year,
      });

      const newPeriod = JSON.parse(
        JSON.stringify(await this.periodRepository.save(period)),
      );

      return {
        statusCode: 200,
        message: this.printMessageLog('El periodo ha sido creado exitosamente'),
        newPeriod,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const periods = await this.periodRepository.find({
        relations: ['idStatePeriod'],
      });
      return {
        statusCode: 200,
        message: 'Todos los periodos han sido devueltos exitosamente',
        periods,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findOne(id: number) {
    try {
      const period = await this.periodRepository.findOne({
        where: { id: id },
        relations: ['idStatePeriod'],
      });
      if (!period) {
        return {
          statusCode: 404,
          message: 'Periodo no encontrado',
        };
      }
      return {
        statusCode: 200,
        message: 'Periodo devuelto exitosamente.',
        period,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findByYear(id: number) {
    try {
      const definningState = await this.statePeriodRepository.findOne({
        where: { name: Rol.DEFINNING },
      });

      const planificationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.PLANIFICATION },
      });

      const registrationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.REGISTRATION },
      });

      const ongoingState = await this.statePeriodRepository.findOne({
        where: { name: Rol.ONGOING },
      });

      const gradesState = await this.statePeriodRepository.findOne({
        where: { name: Rol.GRADES },
      });

      const finishedState = await this.statePeriodRepository.findOne({
        where: { name: Rol.FINISHED },
      });

      const periodOnGoing = await this.periodRepository.findOne({
        where: { year: id, idStatePeriod: { id: ongoingState.id } },
        relations: ['idStatePeriod'],
      });

      const periodOnGrades = await this.periodRepository.findOne({
        where: { year: id, idStatePeriod: { id: gradesState.id } },
        relations: ['idStatePeriod'],
      });

      const periodOnRegistration = await this.periodRepository.findOne({
        where: { year: id, idStatePeriod: { id: registrationState.id } },
        relations: ['idStatePeriod'],
      });

      const periodOnPlanification = await this.periodRepository.findOne({
        where: { year: id, idStatePeriod: { id: planificationState.id } },
        relations: ['idStatePeriod'],
      });

      const periodOnDefinning = await this.periodRepository.find({
        where: { year: id, idStatePeriod: { id: definningState.id } },
        order: { id: 'ASC' },
        relations: ['idStatePeriod'],
      });

      const periodOnFinished = await this.periodRepository.find({
        where: { year: id, idStatePeriod: { id: finishedState.id } },
        order: { id: 'ASC' },
        relations: ['idStatePeriod'],
      });

      const lasPeriodOfTheYearFinished = await this.periodRepository.findOne({
        where: {
          year: id,
          idStatePeriod: { id: finishedState.id },
          numberPeriod: 3,
        },
        relations: ['idStatePeriod'],
      });

      const firstNextYearPeriod = await this.periodRepository.findOne({
        where: { year: id + 1 },
        relations: ['idStatePeriod'],
      });

      const periods = [];

      if (periodOnGoing) periods.push(periodOnGoing);
      if (periodOnGrades) periods.push(periodOnGrades);
      if (periodOnRegistration) periods.push(periodOnRegistration);
      if (periodOnPlanification) periods.push(periodOnPlanification);
      if (
        periodOnGoing?.numberPeriod == 3 ||
        periodOnGrades?.numberPeriod == 3 ||
        lasPeriodOfTheYearFinished
      )
        periods.push(firstNextYearPeriod);
      if (periodOnDefinning.length > 0) periods.push(...periodOnDefinning);
      if (periodOnFinished.length > 0) periods.push(...periodOnFinished);

      return {
        statusCode: 200,
        message: `Periodos del ${id} devueltos exitosamente.`,
        periods,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findPlanificationRegistrationByYear() {
    try {
      const planificationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.PLANIFICATION },
      });

      const registrationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.REGISTRATION },
      });
      const periods = await this.periodRepository.find({
        where: {
          idStatePeriod: In([planificationState.id, registrationState.id]),
        },
        relations: ['idStatePeriod'],
      });

      return {
        statusCode: 200,
        message: `Periodos que esten en planificacion o matricula devueltos exitosamente.`,
        periods,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findOnGoing() {
    try {
      const ongoingState = await this.statePeriodRepository.findOne({
        where: { name: Rol.ONGOING },
      });
      const periods = await this.periodRepository.find({
        where: {
          idStatePeriod: In([ongoingState.id]),
        },
        relations: ['idStatePeriod'],
      });

      return {
        statusCode: 200,
        message: `Periodo En curso devuelto exitosamente.`,
        periods,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findGrades() {
    try {
      const gradesState = await this.statePeriodRepository.findOne({
        where: { name: Rol.GRADES },
      });
      const periods = await this.periodRepository.find({
        where: {
          idStatePeriod: In([gradesState.id]),
        },
        relations: ['idStatePeriod'],
      });

      return {
        statusCode: 200,
        message: `Periodo en Ingreso de notas devuelto exitosamente.`,
        periods,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAcademicCharge() {
    try {
      const periods = await this.periodRepository.find({
        relations: ['idStatePeriod'],
        where: { idStatePeriod: { name: Not(Rol.DEFINNING) } },
      });

      periods.sort((a, b) => {
        // Primero ordenar por año en orden descendente
        if (a.year !== b.year) {
          return b.year - a.year;
        }

        // Luego ordenar por número de período en orden descendente
        return b.numberPeriod - a.numberPeriod;
      });

      return {
        statusCode: 200,
        message: `Periodos con carga academica devueltos exitosamente.`,
        periods,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async update(id: number, updatePeriodDto: UpdatePeriodDto) {
    try {
      const period = await this.periodRepository.findOne({
        where: { id: id },
        relations: ['idStatePeriod'],
      });
      if (!period) {
        throw new NotFoundException('Periodo no encontrado');
      }

      const definningState = await this.statePeriodRepository.findOne({
        where: { name: Rol.DEFINNING },
      });

      const planificationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.PLANIFICATION },
      });

      const registrationState = await this.statePeriodRepository.findOne({
        where: { name: Rol.REGISTRATION },
      });

      const ongoingState = await this.statePeriodRepository.findOne({
        where: { name: Rol.ONGOING },
      });

      const gradesState = await this.statePeriodRepository.findOne({
        where: { name: Rol.GRADES },
      });

      const finishedState = await this.statePeriodRepository.findOne({
        where: { name: Rol.FINISHED },
      });

      if (period.idStatePeriod.id == finishedState.id) {
        throw new NotFoundException(
          'No se puede modificar un periodo que ya ha finalizado',
        );
      }

      if (
        period.idStatePeriod.id == definningState.id &&
        +updatePeriodDto.idStatePeriod !== planificationState.id
      ) {
        throw new NotFoundException(
          'Un periodo en estado Por Definir debe ser actualizado a Planificacion',
        );
      }

      if (
        period.idStatePeriod.id == planificationState.id &&
        +updatePeriodDto.idStatePeriod !== registrationState.id
      ) {
        throw new NotFoundException(
          'Un periodo en estado Planificacion debe ser actualizado a Matricula',
        );
      }

      if (
        period.idStatePeriod.id == registrationState.id &&
        +updatePeriodDto.idStatePeriod !== ongoingState.id
      ) {
        throw new NotFoundException(
          'Un periodo en estado Matricula debe ser actualizado a En curso',
        );
      }

      if (
        period.idStatePeriod.id == ongoingState.id &&
        +updatePeriodDto.idStatePeriod !== gradesState.id
      ) {
        throw new NotFoundException(
          'Un periodo en estado En curso debe ser actualizado a Ingreso de notas',
        );
      }

      if (
        period.idStatePeriod.id == gradesState.id &&
        +updatePeriodDto.idStatePeriod !== finishedState.id
      ) {
        throw new NotFoundException(
          'Un periodo en estado Ingreso de notas debe ser actualizado a Finalizado',
        );
      }

      if (+updatePeriodDto.idStatePeriod == planificationState.id) {
        const existingPeriodsOnPlanification = await this.periodRepository.find(
          {
            where: { idStatePeriod: { id: planificationState.id } },
          },
        );

        if (existingPeriodsOnPlanification.length > 0) {
          throw new NotFoundException(
            'Ya existe un periodo en estado de Planificacion',
          );
        }

        if (period.numberPeriod >= 2) {
          const previousPeriod = await this.periodRepository.findOne({
            where: {
              year: period.year,
              numberPeriod: period.numberPeriod - 1,
            },
            relations: ['idStatePeriod'],
          });

          if (
            previousPeriod.idStatePeriod.id != ongoingState.id &&
            previousPeriod.idStatePeriod.id != gradesState.id &&
            previousPeriod.idStatePeriod.id != finishedState.id
          ) {
            throw new NotFoundException(
              'El periodo anterior debe estar en Curso, Ingreso de notas o Finalizado',
            );
          }
        }

        const existingPeriodsOnDifferentThanRegistration =
          await this.periodRepository.find({
            where: {
              id: Not(period.id),
              idStatePeriod: Not(
                In([
                  definningState.id,
                  ongoingState.id,
                  gradesState.id,
                  finishedState.id,
                ]),
              ),
            },
          });

        if (existingPeriodsOnDifferentThanRegistration.length > 0) {
          throw new NotFoundException(
            'No puede haber un periodo en planificacion si existe un periodo en matricula',
          );
        }
      }

      if (+updatePeriodDto.idStatePeriod == registrationState.id) {
        const existingPeriodsOnRegistration = await this.periodRepository.find({
          where: { idStatePeriod: { id: registrationState.id } },
        });

        if (existingPeriodsOnRegistration.length > 0) {
          throw new NotFoundException(
            'Ya existe un periodo en estado de Matricula',
          );
        }

        const existingPeriodsOnDifferentThanFinishedDefinning =
          await this.periodRepository.find({
            where: {
              id: Not(period.id),
              idStatePeriod: Not(In([finishedState.id, definningState.id])),
            },
          });

        if (existingPeriodsOnDifferentThanFinishedDefinning.length > 0) {
          throw new NotFoundException(
            'Todos los periodos deben de estar en finalizados o por definir',
          );
        }

        // const date = new Date();
        // const days = 5;
        // const restDays = [];
        // for (let i = 0; i < days; i++) {
        //   const day = date.getDate() + i;
        //   const month = date.getMonth() + 1;
        //   const year = date.getFullYear();
        //   const dayFormated = day < 10 ? `0${day}` : day;
        //   const monthFormated = month < 10 ? `0${month}` : month;

        //   restDays.push(`${year}-${monthFormated}-${dayFormated}`);
        // }
        // period.dayOne = restDays[0];
        // period.dayTwo = restDays[1];
        // period.dayThree = restDays[2];
        // period.dayFour = restDays[3];
        // period.dayFive = restDays[4];

        const date = updatePeriodDto.registrationDate;

        const days = this.calculateDays(`${date}`);

        period.dayOne = days[0];
        period.dayTwo = days[1];
        period.dayThree = days[2];
        period.dayFour = days[3];
        period.dayFive = days[4];
      }

      if (+updatePeriodDto.idStatePeriod == ongoingState.id) {
        const existingPeriodsOngoing = await this.periodRepository.find({
          where: { idStatePeriod: { id: ongoingState.id } },
        });

        if (existingPeriodsOngoing.length > 0) {
          throw new NotFoundException(
            'Ya existe un periodo en estado En Curso',
          );
        }

        const existingPeriodsOnDifferentThanGoing =
          await this.periodRepository.find({
            where: {
              id: Not(period.id),
              idStatePeriod: Not(
                In([
                  finishedState.id,
                  definningState.id,
                  planificationState.id,
                ]),
              ),
            },
          });

        if (existingPeriodsOnDifferentThanGoing.length > 0) {
          throw new NotFoundException(
            'Todos los periodos deben de estar en finalizados o por definir o planificacion',
          );
        }
      }

      if (+updatePeriodDto.idStatePeriod == gradesState.id) {
        const existingPeriodsOnGrades = await this.periodRepository.find({
          where: { idStatePeriod: { id: gradesState.id } },
        });

        if (existingPeriodsOnGrades.length > 0) {
          throw new NotFoundException(
            'Ya existe un periodo en estado en Ingreso de notas',
          );
        }
      }

      // Update only the provided fields in the DTO
      if (updatePeriodDto.replacementPaymentDate !== undefined) {
        period.replacementPaymentDate = updatePeriodDto.replacementPaymentDate;
      }

      if (updatePeriodDto.exceptionalCancellationDate !== undefined) {
        period.exceptionalCancellationDate =
          updatePeriodDto.exceptionalCancellationDate;
      }

      if (updatePeriodDto.idStatePeriod !== undefined) {
        const statePeriod = await this.statePeriodRepository.findOne({
          where: { id: updatePeriodDto.idStatePeriod.id },
        });

        if (!statePeriod) {
          throw new NotFoundException(
            'El Estado del periodo proporcionado no fue encontrado',
          );
        }
        period.idStatePeriod = updatePeriodDto.idStatePeriod;
      }

      const updatedPeriod = await this.periodRepository.save(period);

      const periodWithState = await this.periodRepository.findOne({
        where: { id: updatedPeriod.id },
        relations: ['idStatePeriod'],
      });

      if (periodWithState.idStatePeriod.id == ongoingState.id) {
        const tuitionsOnWaitingList = await this.tuitionRepository.find({
          where: {
            section: { idPeriod: { idStatePeriod: { id: ongoingState.id } } },
            waitingList: true,
          },
        });

        if (tuitionsOnWaitingList.length > 0) {
          tuitionsOnWaitingList.forEach(async (tuition) => {
            await this.tuitionRepository.delete(tuition.id);
          });
        }
      }

      if (periodWithState.idStatePeriod.id == finishedState.id) {
        const periodTuitions = await this.tuitionRepository.find({
          relations: ['student', 'section.idClass'],
          where: { section: { idPeriod: { id: period.id } } },
        });

        this.calculateIndex(periodTuitions, true, false);

        const globalTuitions = await this.tuitionRepository.find({
          relations: ['student', 'section.idClass'],
        });
        this.calculateIndex(globalTuitions, false, true);
      }

      return {
        statusCode: 200,
        message: 'Periodo actualizado exitosamente',
        updatedPeriod: periodWithState,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async updateCancelations(
    id: number,
    updatePeriodDto: UpdatePeriodCancelationDto,
  ) {
    try {
      const period = await this.periodRepository.findOne({
        where: { id: id },
        relations: ['idStatePeriod'],
      });
      if (!period) {
        throw new NotFoundException('Periodo no encontrado');
      }

      const ongoingState = await this.statePeriodRepository.findOne({
        where: { name: Rol.ONGOING },
      });

      if (period.idStatePeriod.id != ongoingState.id) {
        throw new NotFoundException(
          'El periodo debe estar en estado de En curso',
        );
      }

      const startDate = new Date(updatePeriodDto.exceptionalCancelationStarts);

      const endDate = new Date(updatePeriodDto.exceptionalCancelationEnds);

      if (startDate >= endDate) {
        throw new NotFoundException(
          'La fecha de inicio no puede ser mayor a la fecha final',
        );
      }

      period.exceptionalCancelationStarts = startDate;
      period.exceptionalCancelationEnds = endDate;

      const updatedPeriod = await this.periodRepository.save(period);

      const periodWithState = await this.periodRepository.findOne({
        where: { id: updatedPeriod.id },
        relations: ['idStatePeriod'],
      });

      return {
        statusCode: 200,
        message: 'Periodo actualizado exitosamente devolviendo fechas',
        updatedPeriod: periodWithState,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} period`;
  }

  async calculateIndex(
    periodTuitions: Tuition[],
    periodIndex: boolean,
    globalIndex: boolean,
  ) {
    // Objeto para almacenar las sumas de notas ponderadas y la suma de unidades valorativas por estudiante
    const sumasPorEstudiante = {};

    // Iterar a través de los registros de clases
    periodTuitions.forEach((registro) => {
      const estudianteId = registro.student.accountNumber; // Puedes usar este ID para identificar a cada estudiante

      // Obtener la nota del registro actual
      const nota = registro.note;

      // Obtener las unidades valorativas de la clase y convertirlas a valor numérico
      const unidadesValorativas = parseInt(registro.section.idClass.valueUnits);

      // Convertir la nota a valor numérico
      const notaValor = parseInt(nota);
      if (notaValor > 0 && notaValor != null) {
        // Si el estudiante no está en el objeto, agregarlo
        if (!sumasPorEstudiante.hasOwnProperty(estudianteId)) {
          sumasPorEstudiante[estudianteId] = {
            sumaNotasPonderadas: 0,
            sumaUnidadesValorativas: 0,
          };
        }

        // Acumular la suma de notas ponderadas y la suma de unidades valorativas para el estudiante
        sumasPorEstudiante[estudianteId].sumaNotasPonderadas +=
          notaValor * unidadesValorativas;
        sumasPorEstudiante[estudianteId].sumaUnidadesValorativas +=
          unidadesValorativas;
      }
    });

    const promediosPorEstudiante = {};

    // Calcular el promedio ponderado de notas para cada estudiante
    for (const estudianteId in sumasPorEstudiante) {
      const { sumaNotasPonderadas, sumaUnidadesValorativas } =
        sumasPorEstudiante[estudianteId];

      if (sumaUnidadesValorativas > 0) {
        const promedioPonderado = Math.round(
          sumaNotasPonderadas / sumaUnidadesValorativas,
        );

        if (globalIndex) {
          const student = await this.studentRepository.findOne({
            where: { accountNumber: estudianteId },
          });
          student.unitValuesSum = sumaUnidadesValorativas;
          student.gradesSum = sumaNotasPonderadas;
          await this.studentRepository.save(student);
        }

        promediosPorEstudiante[estudianteId] = promedioPonderado;
      }
    }

    for (const estudianteId in promediosPorEstudiante) {
      const student = await this.studentRepository.findOne({
        where: { accountNumber: estudianteId },
      });

      if (periodIndex) {
        student.periodIndex = promediosPorEstudiante[estudianteId];
      }
      if (globalIndex) {
        student.overallIndex = promediosPorEstudiante[estudianteId];
      }

      await this.studentRepository.save(student);
    }
  }

  calculateDays(fechaStr: string) {
    // Parsea la cadena de fecha en un objeto Date
    const fecha = new Date(fechaStr);

    const fechasSiguientes = [];

    // Añade 1 día a la fecha y luego calcula los siguientes 3 días
    for (let i = 0; i <= 4; i++) {
      fecha.setDate(fecha.getDate() + (i > 0 ? 1 : 0)); // Agrega 1 día después del primer ciclo
      const siguienteFecha = fecha.toISOString().substring(0, 10);
      fechasSiguientes.push(siguienteFecha);
    }

    return fechasSiguientes;
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
