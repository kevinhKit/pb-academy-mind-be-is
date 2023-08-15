import { Module } from '@nestjs/common';
import { PeriodService } from './period.service';
import { PeriodController } from './period.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { StatePeriod } from 'src/state-period/entities/state-period.entity';
import { SharedModule } from 'src/shared/shared.module';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService],
  imports: [
    TypeOrmModule.forFeature([Period, StatePeriod, Tuition, Student]),
    SharedModule,
  ],
})
export class PeriodModule {}
