import { Module } from '@nestjs/common';
import { CareerClassService } from './career-class.service';
import { CareerClassController } from './career-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerClass } from './entities/career-class.entity';

@Module({
  controllers: [CareerClassController],
  providers: [CareerClassService],
  imports: [TypeOrmModule.forFeature([CareerClass])]
})
export class CareerClassModule {}
