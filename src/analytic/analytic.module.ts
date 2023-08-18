import { Module } from '@nestjs/common';
import { AnalyticService } from './analytic.service';
import { AnalyticController } from './analytic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Student } from 'src/student/entities/student.entity';
import { Career } from 'src/career/entities/career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { CareerChange } from 'src/career-change/entities/career-change.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { Building } from 'src/building/entities/building.entity';
import { CareerClass } from 'src/career-class/entities/career-class.entity';
import { Class } from 'src/class/entities/class.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { ExceptionalCancellation } from 'src/exceptional-cancellation/entities/exceptional-cancellation.entity';
import { Period } from 'src/period/entities/period.entity';
import { Question } from 'src/question/entities/question.entity';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';
import { Section } from 'src/section/entities/section.entity';
import { StatePeriod } from 'src/state-period/entities/state-period.entity';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { TeachingCareer } from 'src/teaching-career/entities/teaching-career.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import { TeacherEvaluation } from 'src/teacher-evaluation/entities/teacher-evaluation.entity';
import { CenterChange } from 'src/center-change/entities/center-change.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [AnalyticController],
  providers: [AnalyticService],
  imports: [TypeOrmModule.forFeature([User, Teacher, Student, Career, RegionalCenter, CareerChange, CenterCareer, Building, CareerClass, Class, Classroom, ExceptionalCancellation, Period, Question, RequirementClass, Section, StatePeriod, StudentCareer, TeachingCareer, Tuition, TeacherEvaluation, CenterChange]),SharedModule]
})
export class AnalyticModule {}
