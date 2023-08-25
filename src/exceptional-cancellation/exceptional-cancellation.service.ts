import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateExceptionalCancellationDto } from './dto/create-exceptional-cancellation.dto';
import { UpdateExceptionalCancellationDto } from './dto/update-exceptional-cancellation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import {
  ExceptionalCancellation,
  cancelationStatus,
} from './entities/exceptional-cancellation.entity';
import { Period } from 'src/period/entities/period.entity';
import { Rol } from 'src/state-period/entities/state-period.entity';
import { Student } from 'src/student/entities/student.entity';
import { Career } from 'src/career/entities/career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

@Injectable()
export class ExceptionalCancellationService {
  private readonly logger = new Logger('ExceptionalCancelationLogger');

  constructor(
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
    @InjectRepository(ExceptionalCancellation)
    private exceptionalCancelationRepository: Repository<ExceptionalCancellation>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Career) private careerRepository: Repository<Career>,
    @InjectRepository(RegionalCenter)
    private regionalCenterRepository: Repository<RegionalCenter>,
  ) {}

  async create({
    idTuition,
    justificationPdf,
    reason,
  }: CreateExceptionalCancellationDto) {
    try {
      const validTuition = await this.tuitionRepository.findOne({
        where: { id: `${idTuition}` },
      });

      if (!validTuition) {
        throw new NotFoundException('La matricula enviada no existe');
      }

      const cancelationExists =
        await this.exceptionalCancelationRepository.findOne({
          where: { idTuition: { id: validTuition.id } },
        });

      if (cancelationExists) {
        throw new NotFoundException(
          'Ya tiene una solicitud para cancelar esa asignatura',
        );
      }

      const validPeriodDate = await this.periodRepository.findOne({
        relations: ['idStatePeriod'],
        where: { idStatePeriod: { name: Rol.ONGOING } },
      });

      if (!validPeriodDate) {
        throw new NotFoundException('El periodo no esta en curso.');
      }

      const startCancelationDate = validPeriodDate.exceptionalCancelationStarts;
      const endCancelationDate = validPeriodDate.exceptionalCancelationEnds;

      if (
        startCancelationDate == null ||
        endCancelationDate == null ||
        !this.isDateInRange(
          startCancelationDate,
          endCancelationDate,
          new Date(),
        )
      ) {
        throw new NotFoundException(
          'El periodo de cancelaciones excepcionales no esta activo.',
        );
      }

      const cancelation = await this.exceptionalCancelationRepository.create({
        idTuition,
        reason,
        justificationPdf,
      });

      await this.exceptionalCancelationRepository.save(cancelation);

      const newCancelation =
        await this.exceptionalCancelationRepository.findOne({
          where: { id: cancelation.id },
          relations: ['idTuition.section.idClass'],
        });

      return {
        message: 'Se ha creado la cancelacion excepcional correctamente',
        statusCode: 200,
        cancelation: newCancelation,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findByStudent(id: Student) {
    try {
      const validStudent = await this.studentRepository.findOne({
        where: { accountNumber: `${id}` },
      });

      if (!validStudent) {
        throw new NotFoundException('El estudiante no ha sido encontrado.');
      }

      const cancelations = await this.exceptionalCancelationRepository.find({
        relations: [
          'idTuition.student',
          'idTuition.section.idClass',
          'idTuition.section.idPeriod',
        ],
        where: {
          idTuition: { student: { accountNumber: validStudent.accountNumber } },
        },
      });

      cancelations.sort((a, b) => {
        const statusA = a.status;
        const statusB = b.status;

        // Asigna un valor numérico basado en el orden definido por cancelationStatus
        const statusOrder = {
          [cancelationStatus.PROGRESS]: 1,
          [cancelationStatus.APPROVED]: 2,
          [cancelationStatus.DENIED]: 3,
        };

        return statusOrder[statusA] - statusOrder[statusB];
      });

      return {
        message: 'Se han devuelto las canciones excepcionales del estudiante',
        statusCode: 200,
        cancelations,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const validPeriod = await this.periodRepository.findOne({
        relations: ['idStatePeriod'],
        where: { idStatePeriod: { name: Rol.ONGOING } },
      });

      if (!validPeriod) {
        throw new NotFoundException('El periodo no esta en curso.');
      }

      const cancelations = await this.exceptionalCancelationRepository.find({
        relations: [
          'idTuition.section.idPeriod.idStatePeriod',
          'idTuition.section.idClass',
          'idTuition.student.user',
        ],
        where: { idTuition: { section: { idPeriod: { id: validPeriod.id } } } },
      });

      cancelations.sort((a, b) => {
        if (
          a.status === cancelationStatus.PROGRESS &&
          b.status !== cancelationStatus.PROGRESS
        ) {
          return -1; // a debe ir antes que b
        } else if (
          a.status !== cancelationStatus.PROGRESS &&
          b.status === cancelationStatus.PROGRESS
        ) {
          return 1; // b debe ir antes que a
        } else {
          return 0; // no se cambia el orden
        }
      });

      return {
        message: 'Se ha creado la cancelacion excepcional correctamente',
        statusCode: 200,
        cancelations,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findByCareer(id: Career, centerId: RegionalCenter) {
    try {
      let careerId = `${id}`;
      careerId = careerId.toUpperCase();
      let idCenter = `${centerId}`;
      idCenter = idCenter.toUpperCase();
      const validPeriod = await this.periodRepository.findOne({
        relations: ['idStatePeriod'],
        where: { idStatePeriod: { name: Rol.ONGOING } },
      });

      if (!validPeriod) {
        throw new NotFoundException('El periodo no esta en curso.');
      }

      const validCareer = await this.careerRepository.findOne({
        where: { id: careerId },
      });

      if (!validCareer) {
        throw new NotFoundException('La carrera no existe.');
      }

      const validRegionalCenter = await this.regionalCenterRepository.findOne({
        where: { id: idCenter },
      });

      if (!validRegionalCenter) {
        throw new NotFoundException('El centro regional no existe.');
      }

      const cancelations = await this.exceptionalCancelationRepository.find({
        relations: [
          'idTuition.section.idPeriod.idStatePeriod',
          'idTuition.section.idClass.careerClass.idCareer',
          'idTuition.section.idClassroom.idBuilding.idRegionalCenter',
          'idTuition.student.user',
        ],
        where: {
          idTuition: {
            section: {
              idPeriod: { id: validPeriod.id },
              idClass: { careerClass: { idCareer: { id: careerId } } },
            },
            student: {
              studentCareer: {
                centerCareer: {
                  career: { id: careerId },
                  regionalCenter: { id: validRegionalCenter.id },
                },
              },
            },
          },
        },
      });

      cancelations.sort((a, b) => {
        if (
          a.status === cancelationStatus.PROGRESS &&
          b.status !== cancelationStatus.PROGRESS
        ) {
          return -1; // a debe ir antes que b
        } else if (
          a.status !== cancelationStatus.PROGRESS &&
          b.status === cancelationStatus.PROGRESS
        ) {
          return 1; // b debe ir antes que a
        } else {
          return 0; // no se cambia el orden
        }
      });

      return {
        message:
          'Se han devuelvo las cancelaciones excepcionales correctamente',
        statusCode: 200,
        cancelations,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} exceptionalCancellation`;
  }

  async findCancelationTuitions(id: Student) {
    try {
      const validStudent = await this.studentRepository.findOne({
        where: { accountNumber: `${id}` },
      });

      if (!validStudent) {
        throw new NotFoundException('El alumno no existe.');
      }

      const tuitionsCancelations = await this.tuitionRepository.find({
        relations: [
          'section.idPeriod.idStatePeriod',
          'section.idClass',
          'student',
        ],
        where: {
          section: { idPeriod: { idStatePeriod: { name: Rol.ONGOING } } },
          student: { accountNumber: `${id}` },
        },
      });

      if (tuitionsCancelations.length == 0) {
        throw new NotFoundException('No tiene clases para cancelar.');
      }

      const startCancelationDate =
        tuitionsCancelations[0].section.idPeriod.exceptionalCancelationStarts;
      const endCancelationDate =
        tuitionsCancelations[0].section.idPeriod.exceptionalCancelationEnds;

      if (
        startCancelationDate == null ||
        endCancelationDate == null ||
        !this.isDateInRange(
          startCancelationDate,
          endCancelationDate,
          new Date(),
        )
      ) {
        throw new NotFoundException(
          'El periodo de cancelaciones excepcionales no esta activo.',
        );
      }

      return {
        message: 'Se han devuelto las matriculas a cancelar',
        statusCode: 200,
        tuitions: tuitionsCancelations,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async update(id: string, { status }: UpdateExceptionalCancellationDto) {
    try {
      const validApplication =
        await this.exceptionalCancelationRepository.findOne({
          relations: ['idTuition'],
          where: { id: id },
        });

      if (!validApplication) {
        throw new NotFoundException('La solicitud no existe.');
      }

      if (status == cancelationStatus.APPROVED) {
        await this.tuitionRepository.delete(validApplication.idTuition.id);
      } else {
        validApplication.status = status;

        await this.exceptionalCancelationRepository.save(validApplication);
      }

      return {
        message: 'Se ha actualizado la cancelacion excepcional correctamente',
        statusCode: 200,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} exceptionalCancellation`;
  }

  isDateInRange(startDate: Date, endDate: Date, dateToCheck: Date): boolean {
    return dateToCheck >= startDate && dateToCheck <= endDate;
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
