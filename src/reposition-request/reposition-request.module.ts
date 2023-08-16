import { Module } from '@nestjs/common';
import { RepositionRequestService } from './reposition-request.service';
import { RepositionRequestController } from './reposition-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Period } from 'src/period/entities/period.entity';
import { RepositionRequest } from './entities/reposition-request.entity';

@Module({
  controllers: [RepositionRequestController],
  providers: [RepositionRequestService],
  imports: [TypeOrmModule.forFeature([RepositionRequest, Student, Period])],
})
export class RepositionRequestModule {}
