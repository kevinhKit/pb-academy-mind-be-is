import { Module } from '@nestjs/common';
import { TuitionService } from './tuition.service';
import { TuitionController } from './tuition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuition } from './entities/tuition.entity';
import { Section } from 'src/section/entities/section.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  controllers: [TuitionController],
  providers: [TuitionService],
  imports: [TypeOrmModule.forFeature([Tuition, Section, Student])],
})
export class TuitionModule {}
