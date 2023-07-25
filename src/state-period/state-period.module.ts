import { Module } from '@nestjs/common';
import { StatePeriodService } from './state-period.service';
import { StatePeriodController } from './state-period.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatePeriod } from './entities/state-period.entity';

@Module({
  controllers: [StatePeriodController],
  providers: [StatePeriodService],
  imports: [TypeOrmModule.forFeature([StatePeriod])]
})
export class StatePeriodModule {}
