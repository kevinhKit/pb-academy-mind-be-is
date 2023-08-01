import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { Classroom } from './entities/classroom.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from 'src/building/entities/building.entity';

@Module({
  controllers: [ClassroomController],
  providers: [ClassroomService],
  imports: [TypeOrmModule.forFeature([Classroom,Building])]
})
export class ClassroomModule {}
