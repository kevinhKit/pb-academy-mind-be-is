import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTeacherEvaluationDto } from './dto/create-teacher-evaluation.dto';
import { UpdateTeacherEvaluationDto } from './dto/update-teacher-evaluation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import { TeacherEvaluation } from './entities/teacher-evaluation.entity';
import {
  Rol,
  StatePeriod,
} from 'src/state-period/entities/state-period.entity';

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
        relations: ['tuition', 'idQuestion'],
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

  findOne(id: number) {
    return `This action returns a #${id} teacherEvaluation`;
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
