import { Module } from '@nestjs/common';
import { PeriodService } from './period.service';
import { PeriodController } from './period.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService],
  imports:[TypeOrmModule.forFeature([Period])]
})
export class PeriodModule {}
