import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { Classroom } from './entities/classroom.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'src/building/entities/building.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

@Injectable()
export class ClassroomService {
  private readonly logger = new Logger('classroomLogger');

  constructor(
    @InjectRepository(Classroom)
    private classrommRepository: Repository<Classroom>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
  ) {}

  async create({
    codeClass,
    building,
    regionalCenterId: id,
  }: CreateClassroomDto) {
    try {
      let regionalCenterId = `${id}`;
      regionalCenterId = regionalCenterId.toUpperCase();

      let buildingId = `${building}`;
      buildingId = buildingId.toUpperCase();

      const classRoomExits = await this.classrommRepository.findOne({
        where: {
          code: codeClass,
          idBuilding: {
            name: buildingId,
            idRegionalCenter: { id: regionalCenterId },
          },
        },
        relations: ['idBuilding'],
      });

      if (classRoomExits) {
        throw new NotFoundException('La aula ya existe');
      }

      const buildingExits = await this.buildingRepository.findOne({
        where: {
          name: buildingId,
          idRegionalCenter: { id: regionalCenterId },
        },
        relations: ['idRegionalCenter'],
      });

      if (!buildingExits) {
        throw new NotFoundException('El edificio proporcionado no existe');
      }

      const newClassroom = await this.classrommRepository.create({
        code: codeClass.toUpperCase(),
        idBuilding: {
          id: buildingExits.id,
        },
      });

      const saveClassroom = await this.classrommRepository.save(newClassroom);

      return {
        statusCode: 200,
        classroom: saveClassroom,
        message: this.printMessageLog('El aula se ha creado exitosamente'),
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    const classRooms = await this.classrommRepository.find({
      relations: ['idBuilding', 'idBuilding.idRegionalCenter'],
    });
    return {
      statusCode: 200,
      message: this.printMessageLog('Las aulas se han devuelto exitosamente'),
      classRooms,
    };
  }

  async findOne(regionalCenterId: RegionalCenter, buildingId: Building) {
    try {
      let buildingName = `${buildingId}`;
      buildingName = buildingName.toUpperCase();

      let regionalCenter = `${regionalCenterId}`;
      regionalCenter = regionalCenter.toUpperCase();

      const classRooms = await this.classrommRepository.find({
        where: {
          idBuilding: {
            name: buildingName,
            idRegionalCenter: { id: regionalCenter },
          },
        },
        relations: ['idBuilding', 'idBuilding.idRegionalCenter'],
      });

      return {
        statusCode: 200,
        message: this.printMessageLog('Las aulas se han devuelto exitosamente'),
        classRooms,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  update(id: number, updateClassroomDto: UpdateClassroomDto) {
    return `This action updates a #${id} classroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} classroom`;
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
