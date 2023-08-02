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

@Injectable()
export class ClassroomService {
  private readonly logger = new Logger('classroomLogger');

  constructor(
    @InjectRepository(Classroom)
    private classrommRepository: Repository<Classroom>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
  ) {}

  async create({ codeClass, building }: CreateClassroomDto) {
    try {
      const classroomExits = await this.classrommRepository.findOne({
        where: {
          code: codeClass.toUpperCase(),
          idBuilding: {
            id: building,
          },
        },
      });

      const buildingExits = await this.buildingRepository.findOne({
        where: {
          id: building,
        },
      });

      if (!buildingExits) {
        throw new NotFoundException('El edificio proporcionado no existe');
      }

      if (classroomExits) {
        throw new ConflictException('El aula ya existe en este edificio.');
      }

      const newClassroom = await this.classrommRepository.create({
        code: codeClass.toUpperCase(),
        idBuilding: {
          id: building,
        },
      });

      const saveClassroom = await this.classrommRepository.save(newClassroom);

      return {
        statusCode: 200,
        classroom: saveClassroom,
        message: this.printMessageLog('El aula se ha creado exitosamente'),
      };
    } catch (error) {
      console.log(error);
      return this.printMessageError(error);
    }
  }

  async findAll() {
    const classRooms = await this.classrommRepository.find();
    return {
      statusCode: 200,
      message: this.printMessageLog('Las aulas se ha creado exitosamente'),
      classRooms,
    };
    return `This action returns all classroom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classroom`;
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
