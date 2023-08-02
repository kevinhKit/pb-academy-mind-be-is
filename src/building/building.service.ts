import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { Building } from './entities/building.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

@Injectable()
export class BuildingService {
  private readonly logger = new Logger('buildingLogger');

  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(RegionalCenter)
    private regionalCenterRepository: Repository<RegionalCenter>,
  ) {}

  async create({ name, regionalCenter, location }: CreateBuildingDto) {
    try {
      const building = await this.buildingRepository.findOne({
        where: {
          name: name.toUpperCase(),
          idRegionalCenter: {
            id: regionalCenter.toUpperCase(),
          },
        },
      });

      const regionalCenterExist = await this.regionalCenterRepository.findOne({
        where: {
          id: regionalCenter.toUpperCase(),
        },
      });

      if (!regionalCenterExist) {
        throw new NotFoundException(
          'El centro regional proporcionado no existe',
        );
      }

      if (building) {
        throw new ConflictException(
          'EL edificio ya existe en el centro regional dado.',
        );
      }

      const newBuilding = await this.buildingRepository.create({
        name: name.toUpperCase(),
        idRegionalCenter: {
          id: regionalCenter.toUpperCase(),
        },
        location: location,
      });

      const saveBuilding = await this.buildingRepository.save(newBuilding);

      return {
        statusCode: 200,
        building: saveBuilding,
        message: this.printMessageLog('El edificio se ha creado exitosamente'),
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    const buildings = await this.buildingRepository.find({
      relations: ['idRegionalCenter'],
    });
    return {
      statusCode: 200,
      buildings,
      message: this.printMessageLog('Edificios devueltos exitosamente'),
    };
  }

  async findOne(id: RegionalCenter) {
    try {
      let regionalCenterId = `${id}`;
      regionalCenterId = regionalCenterId.toUpperCase();
      const validRegionalCenter = await this.regionalCenterRepository.findOne({
        where: { id: `${regionalCenterId}` },
      });

      if (!validRegionalCenter) {
        throw new NotFoundException('El centro regional no existe');
      }

      const centerBuildings = await this.buildingRepository.find({
        where: { idRegionalCenter: { id: regionalCenterId } },
        relations: ['idRegionalCenter'],
      });

      return {
        statusCode: 200,
        message: 'Todos los edificios han sido devueltos exitosamente',
        centerBuildings,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  update(id: number, updateBuildingDto: UpdateBuildingDto) {
    return `This action updates a #${id} building`;
  }

  remove(id: number) {
    return `This action removes a #${id} building`;
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
