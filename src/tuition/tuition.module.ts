import { Module } from '@nestjs/common';
import { TuitionService } from './tuition.service';
import { TuitionController } from './tuition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuition } from './entities/tuition.entity';

@Module({
  controllers: [TuitionController],
  providers: [TuitionService],
  imports: [TypeOrmModule.forFeature([Tuition])]
})
export class TuitionModule {}
