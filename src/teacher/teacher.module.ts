import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService],
  imports: [
    TypeOrmModule.forFeature([Teacher])
  ]
})
export class TeacherModule {}
