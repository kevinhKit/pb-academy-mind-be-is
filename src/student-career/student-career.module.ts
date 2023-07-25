import { Module } from '@nestjs/common';
import { StudentCareerService } from './student-career.service';
import { StudentCareerController } from './student-career.controller';
import { StudentCareer } from './entities/student-career.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [StudentCareerController],
  providers: [StudentCareerService],
  imports:[TypeOrmModule.forFeature([StudentCareer])]
})
export class StudentCareerModule {}
