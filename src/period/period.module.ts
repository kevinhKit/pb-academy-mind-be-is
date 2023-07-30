import { Module } from '@nestjs/common';
import { PeriodService } from './period.service';
import { PeriodController } from './period.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { StatePeriod } from 'src/state-period/entities/state-period.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService],
  imports: [TypeOrmModule.forFeature([Period, StatePeriod]), SharedModule],
})
export class PeriodModule {}
