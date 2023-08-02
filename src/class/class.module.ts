import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { SharedModule } from 'src/shared/shared.module';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';
import { Career } from 'src/career/entities/career.entity';
import { CareerClass } from 'src/career-class/entities/career-class.entity';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  imports: [
    TypeOrmModule.forFeature([Class, RequirementClass, Career, CareerClass]),
    SharedModule,
  ],
})
export class ClassModule {}
