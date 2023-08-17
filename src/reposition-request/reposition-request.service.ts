import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRepositionRequestDto } from './dto/create-reposition-request.dto';
import { UpdateRepositionRequestDto } from './dto/update-reposition-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositionRequest } from './entities/reposition-request.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Period } from 'src/period/entities/period.entity';
import { Rol } from 'src/state-period/entities/state-period.entity';

@Injectable()
export class RepositionRequestService {
  private readonly logger = new Logger('periodLogger');

  constructor(
    @InjectRepository(RepositionRequest)
    private repositionRequestRepository: Repository<RepositionRequest>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
  ) {}

  async create(createRepositionRequestDto: CreateRepositionRequestDto) {
    try {
      const studentExist = await this.studentRepository.findOne({
        where: {
          accountNumber: `${createRepositionRequestDto.idStudent}`,
        },
      });

      if (!studentExist) {
        throw new NotFoundException('No se ha encontrado al estudiante');
      }

      const periodExist = await this.periodRepository.findOne({
        relations: ['idStatePeriod'],
        where: {
          id: +createRepositionRequestDto.idPeriod,
          idStatePeriod: { name: Rol.ONGOING },
        },
      });

      if (!periodExist) {
        throw new NotFoundException(
          'EL periodo enviado no existe o no se encuentra en curso',
        );
      }

      const alreadyExists = await this.repositionRequestRepository.findOne({
        relations: ['idPeriod', 'idStudent'],
        where: {
          idPeriod: { id: +createRepositionRequestDto.idPeriod },
          idStudent: {
            accountNumber: `${createRepositionRequestDto.idStudent}`,
          },
        },
      });

      if (alreadyExists) {
        throw new NotFoundException(
          'Ya ha realizado una solicitud de pago de reposicion en este periodo',
        );
      }

      const newRepositionRequest =
        await this.repositionRequestRepository.create({
          idPeriod: createRepositionRequestDto.idPeriod,
          idStudent: createRepositionRequestDto.idStudent,
          justification: createRepositionRequestDto.justification
        });

      const savedRepositionRequest =
        await this.repositionRequestRepository.save(newRepositionRequest);

      return {
        message:
          'Se ha creado la solicitud de pago de reposicion correctamente',
        statusCode: 200,
        repositionRequest: savedRepositionRequest,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  findAll() {
    return `This action returns all repositionRequest`;
  }

  async findOne(id: Student) {
    try {
      const studentExist = await this.studentRepository.findOne({
        where: {
          accountNumber: `${id}`,
        },
      });

      if (!studentExist) {
        throw new NotFoundException('No se ha encontrado al estudiante');
      }

      const repositionRequests = await this.repositionRequestRepository.find({
        relations: ['idStudent', 'idPeriod'],
        where: { idStudent: { accountNumber: `${id}` } },
      });

      repositionRequests.sort((a, b) => {
        const idPeriodA = a.idPeriod;
        const idPeriodB = b.idPeriod;

        if (idPeriodA.year === idPeriodB.year) {
          return idPeriodB.numberPeriod - idPeriodA.numberPeriod; // Invertir el orden aquí
        } else {
          return idPeriodB.year - idPeriodA.year; // Invertir el orden aquí
        }
      });

      return {
        message:
          'Se ha creado la solicitud de pago de reposicion correctamente',
        statusCode: 200,
        repositionRequests,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  update(id: number, updateRepositionRequestDto: UpdateRepositionRequestDto) {
    return `This action updates a #${id} repositionRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} repositionRequest`;
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
