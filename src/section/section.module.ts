import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Period } from 'src/period/entities/period.entity';
import { Class } from 'src/class/entities/class.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';

@Module({
  controllers: [SectionController],
  providers: [SectionService],
  imports: [
    TypeOrmModule.forFeature([
      Section,
      Teacher,
      Classroom,
      Period,
      Class,
      Tuition,
    ]),
  ],
})
export class SectionModule {}
