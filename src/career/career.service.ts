import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Career } from './entities/career.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';

@Injectable()
export class CareerService {
  private readonly logger = new Logger('careerLogger');

  constructor(
    @InjectRepository(Career) private careerRepository: Repository<Career>,
    @InjectRepository(RegionalCenter)
    private regionalCenterRepository: Repository<RegionalCenter>,
    @InjectRepository(CenterCareer)
    private centerCareerRepository: Repository<CenterCareer>,
  ) {}

  async create({ id, name, raceCode, centerId }: CreateCareerDto) {
    try {
      const centerExists = await this.validateCenters(centerId);

      if (!centerExists) {
        throw new NotFoundException('El centro regional enviado no existe.');
      }

      const careerExists = await this.careerRepository.findOne({
        where: {
          id,
        },
      });

      if (careerExists) {
        throw new ConflictException('La Carrera ya existe');
      }

      const career = await this.careerRepository.create({
        id: id.toUpperCase(),
        name: name.toUpperCase(),
        raceCode,
      });

      await this.careerRepository.save(career);

      if (centerExists) {
        const careerCenters = centerId.map((center) => {
          let newCenter = `${center}`;
          newCenter = newCenter.toUpperCase();
          return this.centerCareerRepository.create({
            career: { id: `${career.id.toUpperCase()}` },
            regionalCenter: { id: `${newCenter}` },
          });
        });

        const createdCareerCenters = await this.centerCareerRepository.insert(
          careerCenters,
        );
      }

      return {
        statusCode: 200,
        message: this.printMessageLog('La Carrera se ha creado exitosamente'),
        career,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const allCareer = await this.careerRepository.find();
      return {
        statusCode: 200,
        message: this.printMessageLog(
          'Todas las carreras han sido obtenidas exitosamente',
        ),
        careers: allCareer,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} career`;
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    try {
      const careerId = id.toUpperCase();

      const validCareer = await this.careerRepository.findOne({
        where: { id: careerId },
      });

      if (!validCareer) {
        throw new NotFoundException('La carrera enviada no existe.');
      }

      const centerExists = await this.validateCenters(updateCareerDto.centerId);

      if (!centerExists) {
        throw new NotFoundException('El centro regional enviado no existe.');
      }

      updateCareerDto.centerId.forEach(async (center) => {
        let newCenter = `${center}`;
        newCenter = newCenter.toUpperCase();
        const alreadyExists = await this.centerCareerRepository.findOne({
          where: {
            career: { id: `${validCareer.id.toUpperCase()}` },
            regionalCenter: { id: `${newCenter}` },
          },
        });
        if (alreadyExists) {
          throw new NotFoundException(
            'Ya existe esa carrera en ese centro regional',
          );
        }
      });

      const careerCenters = updateCareerDto.centerId.map((center) => {
        let newCenter = `${center}`;
        newCenter = newCenter.toUpperCase();
        return this.centerCareerRepository.create({
          career: { id: `${validCareer.id.toUpperCase()}` },
          regionalCenter: { id: `${newCenter}` },
        });
      });

      const createdCareerCenters = await this.centerCareerRepository.insert(
        careerCenters,
      );

      return {
        statusCode: 200,
        message: this.printMessageLog(
          'Se ha actualizado la carrera exitosamente',
        ),
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} career`;
  }

  async validateCenters(centers: RegionalCenter[]) {
    const validCenters = await Promise.all(
      centers.map(async (id) => {
        let newId = `${id}`;
        newId = newId.toUpperCase();
        const center = await this.regionalCenterRepository.findOne({
          where: { id: `${newId}` },
        });
        return center;
      }),
    );

    return validCenters.every(Boolean);
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
