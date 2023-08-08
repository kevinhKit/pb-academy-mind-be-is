import { Module } from '@nestjs/common';
import { CareerChangeService } from './career-change.service';
import { CareerChangeController } from './career-change.controller';
import { CareerChange } from './entities/career-change.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { CenterChange } from 'src/center-change/entities/center-change.entity';

@Module({
  controllers: [CareerChangeController],
  providers: [CareerChangeService],
  imports: [TypeOrmModule.forFeature([CareerChange,CenterChange,Student,CenterCareer,StudentCareer])],
})
export class CareerChangeModule {}
