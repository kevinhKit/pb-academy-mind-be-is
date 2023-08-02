import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { Career } from './entities/career.entity';
import { TeachingCareer } from 'src/teaching-career/entities/teaching-career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';

@Module({
  controllers: [CareerController],
  providers: [CareerService],
  imports: [
    TypeOrmModule.forFeature([
      Career,
      TeachingCareer,
      RegionalCenter,
      CenterCareer,
    ]),
  ],
})
export class CareerModule {}
