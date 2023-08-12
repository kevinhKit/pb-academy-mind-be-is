import { Module } from '@nestjs/common';
import { CareerClassService } from './career-class.service';
import { CareerClassController } from './career-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerClass } from './entities/career-class.entity';
import { Career } from 'src/career/entities/career.entity';
import { Class } from 'src/class/entities/class.entity';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';
import { Student } from 'src/student/entities/student.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';

@Module({
  controllers: [CareerClassController],
  providers: [CareerClassService],
  imports: [
    TypeOrmModule.forFeature([
      CareerClass,
      Career,
      Class,
      RequirementClass,
      Student,
      Tuition,
    ]),
  ],
})
export class CareerClassModule {}
