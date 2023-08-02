import { Module } from '@nestjs/common';
import { CareerClassService } from './career-class.service';
import { CareerClassController } from './career-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerClass } from './entities/career-class.entity';
import { Career } from 'src/career/entities/career.entity';
import { Class } from 'src/class/entities/class.entity';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';

@Module({
  controllers: [CareerClassController],
  providers: [CareerClassService],
  imports: [
    TypeOrmModule.forFeature([CareerClass, Career, Class, RequirementClass]),
  ],
})
export class CareerClassModule {}
