import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachingCareerService } from './teaching-career.service';
import { TeachingCareerController } from './teaching-career.controller';
import { TeachingCareer } from './entities/teaching-career.entity';

@Module({
  controllers: [TeachingCareerController],
  providers: [TeachingCareerService],
  imports:[TypeOrmModule.forFeature([TeachingCareer])]
})
export class TeachingCareerModule {}
