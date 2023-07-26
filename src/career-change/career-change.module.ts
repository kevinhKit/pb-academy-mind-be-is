import { Module } from '@nestjs/common';
import { CareerChangeService } from './career-change.service';
import { CareerChangeController } from './career-change.controller';
import { CareerChange } from './entities/career-change.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CareerChangeController],
  providers: [CareerChangeService],
  imports: [TypeOrmModule.forFeature([CareerChange])],
})
export class CareerChangeModule {}
