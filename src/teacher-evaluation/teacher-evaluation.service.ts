import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTeacherEvaluationDto } from './dto/create-teacher-evaluation.dto';
import { UpdateTeacherEvaluationDto } from './dto/update-teacher-evaluation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import {
  TeacherEvaluation,
  answerType,
} from './entities/teacher-evaluation.entity';
import {
  Rol,
  StatePeriod,
} from 'src/state-period/entities/state-period.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Period } from 'src/period/entities/period.entity';
import { Class } from 'src/class/entities/class.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

@Injectable()
export class TeacherEvaluationService {
  private readonly logger = new Logger('periodLogger');

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Tuition) private tuitionRepository: Repository<Tuition>,
    @InjectRepository(TeacherEvaluation)
    private teacherEvaluationRepository: Repository<TeacherEvaluation>,
    @InjectRepository(StatePeriod)
    private statePeriodRepository: Repository<StatePeriod>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(Period) private periodRepository: Repository<Period>,
    @InjectRepository(RegionalCenter)
    private regionalCenterRepository: Repository<RegionalCenter>,
  ) {}
  async create(createTeacherEvaluationDto: CreateTeacherEvaluationDto) {
    try {
      const validQuestion = await this.questionRepository.findOne({
        where: { id: `${createTeacherEvaluationDto.questionId}` },
      });

      if (!validQuestion) {
        throw new NotFoundException('La pregunta no existe.');
      }

      const validTuition = await this.tuitionRepository.findOne({
        where: { id: `${createTeacherEvaluationDto.tuitionId}` },
        relations: ['section.idPeriod.idStatePeriod'],
      });

      if (!validTuition) {
        throw new NotFoundException('La matricula no existe.');
      }

      const gradesState = await this.statePeriodRepository.findOne({
        where: { name: Rol.GRADES },
      });

      if (validTuition.section.idPeriod.idStatePeriod.id != gradesState.id) {
        throw new NotFoundException(
          'La matricula no se encuentra en ingreso de calificaciones.',
        );
      }

      const evaluationExists = await this.teacherEvaluationRepository.findOne({
        where: {
          idQuestion: { id: `${createTeacherEvaluationDto.questionId}` },
          tuition: { id: `${createTeacherEvaluationDto.tuitionId}` },
        },
      });

      if (evaluationExists) {
        throw new NotFoundException('Ya se ha realizado esta evaluacion.');
      }

      const teacherEvaluation = await this.teacherEvaluationRepository.create({
        idQuestion: createTeacherEvaluationDto.questionId,
        tuition: createTeacherEvaluationDto.tuitionId,
      });

      if (createTeacherEvaluationDto.answer) {
        teacherEvaluation.answer = createTeacherEvaluationDto.answer;
      }

      if (createTeacherEvaluationDto.openAnswer) {
        teacherEvaluation.openAnswer = createTeacherEvaluationDto.openAnswer;
      }

      const newTeacherEvaluation = await this.teacherEvaluationRepository.save(
        teacherEvaluation,
      );

      const questions = await this.questionRepository.find();
      const questionsLenght = questions.length;

      const allTuitionEvaluations = await this.teacherEvaluationRepository.find(
        {
          where: { tuition: { id: `${createTeacherEvaluationDto.tuitionId}` } },
        },
      );

      const allTuitionEvaluationsLenght = allTuitionEvaluations.length;

      if (questionsLenght === allTuitionEvaluationsLenght) {
        validTuition.teacherEvaluationDone = true;
        await this.tuitionRepository.save(validTuition);
      }

      return {
        statusCode: 200,
        message: this.printMessageLog('La evaluacion se ha creado con exito.'),
        evaluation: newTeacherEvaluation,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const evaluations = await this.teacherEvaluationRepository.find({
        relations: [
          'idQuestion',
          'tuition.section.idPeriod',
          'tuition.section.idClass',
          'tuition.section.idTeacher',
        ],
      });

      return {
        statusCode: 200,
        message: this.printMessageLog(
          'Las evaluaciones se han devuelto con exito.',
        ),
        evaluations,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findOne(id: string, centerId: RegionalCenter) {
    try {
      let idCenter = `${centerId}`;
      idCenter = idCenter.toUpperCase();

      const gradesState = await this.statePeriodRepository.findOne({
        where: { name: Rol.GRADES },
      });

      const existingCenter = await this.regionalCenterRepository.findOne({
        where: { id: idCenter },
      });

      if (!existingCenter) {
        throw new NotFoundException('El centro regional no existe.');
      }

      const teachers = await this.tuitionRepository.find({
        relations: [
          'section.idTeacher.user',
          'section.idTeacher.teachingCareer.centerCareer.regionalCenter',
          'section.idClass',
          'section.idPeriod',
        ],
        where: {
          section: {
            idPeriod: { idStatePeriod: { id: gradesState.id } },
            idClass: { departmentId: id.toUpperCase() },
            idTeacher: {
              teachingCareer: {
                centerCareer: { regionalCenter: { id: idCenter } },
              },
            },
          },
        },
      });

      const uniquePairs = {};

      // Filtrar y eliminar objetos repetidos
      const filteredData = teachers.filter((obj) => {
        const teacherId = obj.section.idTeacher.employeeNumber;
        const classId = obj.section.idClass.id;

        const key = `${teacherId}_${classId}`;

        // Si el par docente-clase no ha sido visto antes, lo agregamos a uniquePairs
        if (!uniquePairs[key]) {
          uniquePairs[key] = true;
          return true; // Mantener el objeto en el resultado
        }

        return false; // Descartar el objeto duplicado
      });

      return {
        statusCode: 200,
        message: this.printMessageLog(
          'Los docentes a evaluar han sido devueltos exitosamente.',
        ),
        teachers: filteredData,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findTeacherNotes(idTeacher: Teacher, idPeriod: Period, idClass: Class) {
    try {
      const validPeriod = await this.periodRepository.findOne({
        where: { id: +idPeriod },
      });

      if (!validPeriod) {
        throw new NotFoundException('El periodo enviado no existe.');
      }

      const validClass = await this.classRepository.findOne({
        where: { id: +idClass },
      });

      if (!validClass) {
        throw new NotFoundException('La clase enviada no existe.');
      }

      const validTeacher = await this.teacherRepository.findOne({
        where: { employeeNumber: `${idTeacher}` },
      });

      if (!validTeacher) {
        throw new NotFoundException('El docente enviado no existe.');
      }

      const evaluations = await this.teacherEvaluationRepository.find({
        relations: [
          'tuition.section.idPeriod',
          'tuition.section.idClass',
          'tuition.section.idTeacher',
          'idQuestion',
        ],
        where: {
          tuition: {
            section: {
              idTeacher: { employeeNumber: `${validTeacher.employeeNumber}` },
              idPeriod: { id: validPeriod.id },
              idClass: { id: validClass.id },
            },
          },
        },
      });

      const questions = await this.questionRepository.find();

      const evaluationCount = [];

      questions.forEach((question) => {
        evaluationCount.push({
          questionId: question.id,
          question: question.question,
          excelentCount: 0,
          greatCount: 0,
          regularCount: 0,
          insuficcientCount: 0,
          deficcientCount: 0,
        });
      });

      const observations = { observations: [] };

      evaluationCount.forEach((question) => {
        evaluations.forEach((evaluation) => {
          if (question.questionId === evaluation.idQuestion.id) {
            if (evaluation.answer == answerType.EXCELENT) {
              question.excelentCount += 1;
            }
            if (evaluation.answer == answerType.GREAT) {
              question.greatCount += 1;
            }
            if (evaluation.answer == answerType.REGULAR) {
              question.regularCount += 1;
            }
            if (evaluation.answer == answerType.INSUFICCIENT) {
              question.insuficcientCount += 1;
            }
            if (evaluation.answer == answerType.DEFICCIENT) {
              question.deficcientCount += 1;
            }
            if (evaluation.openAnswer !== null) {
              observations.observations.push(evaluation.openAnswer);
            }
          }
        });
      });

      evaluationCount.push(observations);

      return {
        statusCode: 200,
        message: this.printMessageLog(
          `Las evaluaciones del docente ${idTeacher} en el periodo ${idPeriod} de la clase ${idClass} se han devuelto exitosamente`,
        ),
        evaluationCount,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  update(id: number, updateTeacherEvaluationDto: UpdateTeacherEvaluationDto) {
    return `This action updates a #${id} teacherEvaluation`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacherEvaluation`;
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
