import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { Repository } from 'typeorm';
import { StatePeriod } from 'src/state-period/entities/state-period.entity';

@Injectable()
export class PeriodService {
  private readonly logger = new Logger('periodLogger');

  constructor(
    @InjectRepository(Period)
    private periodRepository: Repository<Period>,
    @InjectRepository(StatePeriod)
    private statePeriodRepository: Repository<StatePeriod>,
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

  async update(id: number, updatePeriodDto: UpdatePeriodDto) {
    try {
      const period = await this.periodRepository.findOne({
        where: { id: id },
      });
      if (!period) {
        throw new NotFoundException('Periodo no encontrado');
      }

      // Update only the provided fields in the DTO
      if (updatePeriodDto.replacementPaymentDate !== undefined) {
        period.replacementPaymentDate = updatePeriodDto.replacementPaymentDate;
      }

      if (updatePeriodDto.exceptionalCancellationDate !== undefined) {
        period.exceptionalCancellationDate =
          updatePeriodDto.exceptionalCancellationDate;
      }

      const updatedPeriod = await this.periodRepository.save(period);

      return {
        statusCode: 200,
        message: 'Periodo actualizado exitosamente',
        updatedPeriod,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} period`;
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
