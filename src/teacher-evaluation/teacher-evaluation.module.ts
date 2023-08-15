import { Module } from '@nestjs/common';
import { TeacherEvaluationService } from './teacher-evaluation.service';
import { TeacherEvaluationController } from './teacher-evaluation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherEvaluation } from './entities/teacher-evaluation.entity';
import { Question } from 'src/question/entities/question.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import { StatePeriod } from 'src/state-period/entities/state-period.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Period } from 'src/period/entities/period.entity';
import { Class } from 'src/class/entities/class.entity';

@Module({
  controllers: [TeacherEvaluationController],
  providers: [TeacherEvaluationService],
  imports: [
    TypeOrmModule.forFeature([
      TeacherEvaluation,
      Question,
      Tuition,
      StatePeriod,
      Teacher,
      Period,
      Class,
    ]),
  ],
})
export class TeacherEvaluationModule {}
