import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { User } from 'src/user/entities/user.entity';
import { TeachingCareer } from 'src/teaching-career/entities/teaching-career.entity';
import { GenerateEmailService } from 'src/shared/generate-email/generate-email.service';
import { GenerateEmployeeNumberService } from 'src/shared/generte-employee-number/generate-employee-number.service';
import { SendEmailService } from 'src/shared/send-email/send-email.service';
import { EncryptPasswordService } from 'src/shared/encrypt-password/encrypt-password.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService],//,SendEmailService,EncryptPasswordService,GenerteEmployeeNumberService,GenerateEmailService
  imports: [TypeOrmModule.forFeature([Teacher, User, TeachingCareer]),SharedModule],
})
export class TeacherModule {}
