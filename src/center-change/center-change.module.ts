import { Module } from '@nestjs/common';
import { CenterChangeService } from './center-change.service';
import { CenterChangeController } from './center-change.controller';
import { CenterChange } from './entities/center-change.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { Student } from 'src/student/entities/student.entity';
import { CareerChange } from 'src/career-change/entities/career-change.entity';

@Module({
  controllers: [CenterChangeController],
  providers: [CenterChangeService],
  imports: [TypeOrmModule.forFeature([CenterChange,CareerChange,Student,CenterCareer,StudentCareer])],
})
export class CenterChangeModule {}
