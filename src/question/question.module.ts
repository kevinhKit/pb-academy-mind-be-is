import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherEvaluation } from 'src/teacher-evaluation/entities/teacher-evaluation.entity';
import { Question } from './entities/question.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [TypeOrmModule.forFeature([TeacherEvaluation, Question, Tuition])],
})
export class QuestionModule {}
