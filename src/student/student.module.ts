import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from 'src/user/entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { Career } from 'src/career/entities/career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { CareerChange } from 'src/career-change/entities/career-change.entity';
import { CenterChange } from 'src/center-change/entities/center-change.entity';
import { Period } from 'src/period/entities/period.entity';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [TypeOrmModule.forFeature([Student, User, CenterCareer, StudentCareer, CareerChange, CenterChange, Period]),SharedModule],
})
export class StudentModule {}
