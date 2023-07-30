import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateStatePeriodDto } from './dto/create-state-period.dto';
import { UpdateStatePeriodDto } from './dto/update-state-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatePeriod } from './entities/state-period.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatePeriodService {
  private readonly logger = new Logger('statePeriodLogger');

  constructor(
    @InjectRepository(StatePeriod)
    private statePeriodRepository: Repository<StatePeriod>,
  ) {}

  async create(createStatePeriodDto: CreateStatePeriodDto) {
    try {
      const statePeriod = await this.statePeriodRepository.create({
        name: createStatePeriodDto.name,
        replacementPaymentDate: createStatePeriodDto.replacementPaymentDate,
        exceptionalCancellationDate:
          createStatePeriodDto.exceptionalCancellationDate,
      });

      const newStatePeriod = JSON.parse(
        JSON.stringify(await this.statePeriodRepository.save(statePeriod)),
      );

      return {
        statusCode: 200,
        message: this.printMessageLog(
          'El estado de periodo se ha agregado exitosamente',
        ),
        statePeriod: newStatePeriod,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const statePeriods = await this.statePeriodRepository.find();
      return {
        statusCode: 200,
        message:
          'Todos los estados de periodo han sido devueltos exitosamente.',
        statePeriods,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findOne(id: number) {
    try {
      const statePeriod = await this.statePeriodRepository.findOne({
        where: { id: id },
      });
      if (!statePeriod) {
        return {
          statusCode: 404,
          message: 'Estado de periodo no encontrado',
        };
      }
      return {
        statusCode: 200,
        message: 'Estado de periodo devuelto exitosamente',
        statePeriod,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async update(id: number, updateStatePeriodDto: UpdateStatePeriodDto) {
    try {
      const statePeriod = await this.statePeriodRepository.findOne({
        where: { id: id },
      });
      if (!statePeriod) {
        throw new NotFoundException('Estado de periodo no encontrado');
      }

      // Update only the provided fields in the DTO
      if (updateStatePeriodDto.replacementPaymentDate !== undefined) {
        statePeriod.replacementPaymentDate =
          updateStatePeriodDto.replacementPaymentDate;
      }

      if (updateStatePeriodDto.exceptionalCancellationDate !== undefined) {
        statePeriod.exceptionalCancellationDate =
          updateStatePeriodDto.exceptionalCancellationDate;
      }

      // Save the updated entity
      const updatedStatePeriod = await this.statePeriodRepository.save(
        statePeriod,
      );

      return {
        statusCode: 200,
        message: 'Estado de periodo actualizado correctamente',
        statePeriod: updatedStatePeriod,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} statePeriod`;
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
