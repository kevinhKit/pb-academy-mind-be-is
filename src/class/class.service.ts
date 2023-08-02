import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';
import { Career } from 'src/career/entities/career.entity';
import { CareerClass } from 'src/career-class/entities/career-class.entity';

@Injectable()
export class ClassService {
  private readonly logger = new Logger('classLogger');

  constructor(
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(RequirementClass)
    private requirementClassRepository: Repository<RequirementClass>,
    @InjectRepository(Career) private careerRepository: Repository<Career>,
    @InjectRepository(CareerClass)
    private careerClassRepository: Repository<CareerClass>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    try {
      const validCareer = await this.careerRepository.findOne({
        where: { id: `${createClassDto.careerId}` },
      });

      if (!validCareer) {
        throw new NotFoundException('La carrera no existe');
      }

      const validClass = await this.validateRequisites(
        createClassDto.requisites,
      );
      if (!validClass) {
        throw new NotFoundException('La clase requisito no existe');
      }

      const createClass = await this.classRepository.create({
        name: createClassDto.name,
        code: createClassDto.code,
        valueUnits: createClassDto.valueUnits,
      });

      let newClass = JSON.parse(
        JSON.stringify(await this.classRepository.save(createClass)),
      );

      if (createClassDto.requisites && validClass) {
        const clasesRequirements = createClassDto.requisites.map((requisite) =>
          this.requirementClassRepository.create({
            idClass: newClass.id,
            idRequirement: requisite,
          }),
        );

        const createdRequirements =
          await this.requirementClassRepository.insert(clasesRequirements);

        newClass = await this.classRepository.findOne({
          where: { id: newClass.id },
          relations: ['classCurrent', 'classCurrent.idRequirement'],
        });
      }

      const careerClass = await this.careerClassRepository.create({
        idClass: newClass.id,
        idCareer: createClassDto.careerId,
      });

      await this.careerClassRepository.save(careerClass);

      return {
        statusCode: 200,
        message: 'La clase ha sido creada exitosamente.',
        newClass,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const classes = await this.classRepository.find({
        relations: ['classCurrent', 'classCurrent.idRequirement'],
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

  async findOne(id: number) {
    try {
      const getClass = await this.classRepository.findOne({
        where: { id: id },
        relations: ['classCurrent', 'classCurrent.idRequirement'],
      });
      if (!getClass) {
        return {
          statusCode: 404,
          message: 'Clase no encontrada',
        };
      }
      return {
        statusCode: 200,
        message: 'Clase devuelta exitosamente.',
        class: getClass,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }

  async validateRequisites(requisites: Class[]) {
    if (!requisites || requisites.length === 0) {
      return true;
    }

    const validClassIds = await Promise.all(
      requisites.map(async (id) => {
        const classEntity = await this.classRepository.findOne({
          where: { id: id.id },
        });
        return classEntity;
      }),
    );

    return validClassIds.every(Boolean);
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
