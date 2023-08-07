import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCareerClassDto } from './dto/create-career-class.dto';
import { UpdateCareerClassDto } from './dto/update-career-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/class/entities/class.entity';
import { Repository } from 'typeorm';
import { Career } from 'src/career/entities/career.entity';
import { CareerClass } from './entities/career-class.entity';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';

@Injectable()
export class CareerClassService {
  private readonly logger = new Logger('classLogger');

  constructor(
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(Career) private careerRepository: Repository<Career>,
    @InjectRepository(CareerClass)
    private careerClassRepository: Repository<CareerClass>,
    @InjectRepository(RequirementClass)
    private requirementClassRepository: Repository<RequirementClass>,
  ) {}

  create(createCareerClassDto: CreateCareerClassDto) {
    return 'This action adds a new careerClass';
  }

  findAll() {
    return `This action returns all careerClass`;
  }

  async findOne(id: Career) {
    try {
      let careerId = `${id}`;
      careerId = careerId.toUpperCase();
      const validCareer = await this.careerRepository.findOne({
        where: { id: `${careerId}` },
      });

      if (!validCareer) {
        throw new NotFoundException('La carrera no existe');
      }

      const classesWithId = await this.careerClassRepository.find({
        where: { idCareer: { id: careerId } },
        relations: [
          'idClass',
          'idClass.classCurrent',
          'idClass.classCurrent.idRequirement',
        ],
      });

      const classesWithoutId = classesWithId.map((careerClass) => {
        const { id, ...classWithoutId } = careerClass;
        return classWithoutId;
      });

      const classes = classesWithoutId.map((careerClass) => {
        return {
          ...careerClass.idClass,
          idCareer: careerClass.idCareer,
        };
      });

      return {
        statusCode: 200,
        message: 'Todas las clases han sido devueltas exitosamente',
        classes,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findClassDepartment(id: Career) {
    try {
      let careerId = `${id}`;
      careerId = careerId.toUpperCase();
      const validCareer = await this.careerRepository.findOne({
        where: { id: `${careerId}` },
      });

      if (!validCareer) {
        throw new NotFoundException('La carrera no existe');
      }

      const departmentClasses = await this.classRepository.find({
        where: { departmentId: careerId },
      });

      return {
        statusCode: 200,
        message: `Todas las clases del departamento ${id} han sido devueltas exitosamente`,
        departmentClasses,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  update(id: number, updateCareerClassDto: UpdateCareerClassDto) {
    return `This action updates a #${id} careerClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} careerClass`;
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
