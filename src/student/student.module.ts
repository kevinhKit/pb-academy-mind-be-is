import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController, StudentControllerV2 } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from 'src/user/entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [StudentController, StudentControllerV2],
  providers: [StudentService],
  imports: [TypeOrmModule.forFeature([Student, User]),SharedModule],
})
export class StudentModule {}
