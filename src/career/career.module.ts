import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { Career } from './entities/career.entity';

@Module({
  controllers: [CareerController],
  providers: [CareerService],
  imports: [TypeOrmModule.forFeature([Career])]
})
export class CareerModule {}
