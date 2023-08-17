import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCareerClassDto } from './dto/create-career-class.dto';
import { UpdateCareerClassDto } from './dto/update-career-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/class/entities/class.entity';
import { Repository } from 'typeorm';
import { Career } from 'src/career/entities/career.entity';
import { CareerClass } from './entities/career-class.entity';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';
import { Student } from 'src/student/entities/student.entity';
import { Tuition, classStatus } from 'src/tuition/entities/tuition.entity';

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
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
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

  async findClassRequirements(id: Career, studentId: Student) {
    try {
      let careerId = `${id}`;
      careerId = careerId.toUpperCase();
      const validCareer = await this.careerRepository.findOne({
        where: { id: `${careerId}` },
      });

      if (!validCareer) {
        throw new NotFoundException('La carrera no existe');
      }

      const validStudent = await this.studentRepository.findOne({
        where: { accountNumber: `${studentId}` },
      });

      if (!validStudent) {
        throw new NotFoundException('El estudiante no existe');
      }

      const approbedClasses = await this.tuitionRepository.find({
        where: {
          student: { accountNumber: validStudent.accountNumber },
          stateClass: classStatus.APPROVED,
        },
        relations: ['section.idClass.classCurrent.idRequirement'],
      });

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

      const classesToGo = [];

      classes.forEach((classs) => {
        // No tengo clases aprobadas y las clases no tienen requisito
        if (approbedClasses.length === 0 && classs.classCurrent.length === 0) {
          classesToGo.push(classs);
        }

        // Tengo clases aprobadas
        if (approbedClasses.length > 0) {
          //La clase tiene requisito
          if (classs.classCurrent.length != 0) {
            if (
              !this.validateHaventPassedClass(classs, approbedClasses) &&
              this.validateClassRequirements(
                classs.classCurrent,
                approbedClasses,
              )
            ) {
              classesToGo.push(classs);
            }
          }
          //La clase no tiene requisito
          else {
            if (!this.validateHaventPassedClass(classs, approbedClasses)) {
              classesToGo.push(classs);
            }
          }
        }
      });

      return {
        statusCode: 200,
        message:
          'Las clases que el estudiante puede llevar han sido devueltas exitosamente',
        classesToGo,
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

  validateClassRequirements(
    classCurrent: RequirementClass[],
    approbedClasses: Tuition[],
  ) {
    if (classCurrent.length === 0) {
      return true;
    }

    const idsApprobed = approbedClasses.map((obj) => obj.section.idClass.id);

    for (let i = 0; i < classCurrent.length; i++) {
      if (!idsApprobed.includes(classCurrent[i].idRequirement.id)) {
        return false;
      }
    }

    return true;
  }
  validateHaventPassedClass(classs: Class, approbedClasses: Tuition[]) {
    const idsApprobed = approbedClasses.map((obj) => obj.section.idClass.id);

    if (idsApprobed.includes(classs.id)) {
      return true;
    }
    return false;
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
