import { Injectable, Logger } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger('periodLogger');

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    try {
      const question = await this.questionRepository.create({
        question: createQuestionDto.question,
      });

      await this.questionRepository.save(question);

      return {
        statusCode: 200,
        message: this.printMessageLog('La pregunta se ha creado con exito.'),
        question,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    try {
      const questions = await this.questionRepository.find();

      return {
        statusCode: 200,
        message: this.printMessageLog(
          'Las preguntas se han devuelto con exito.',
        ),
        questions,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
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
