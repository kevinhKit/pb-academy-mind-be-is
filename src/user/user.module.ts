import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SendEmailService } from 'src/shared/send-email/send-email.service';
import { EncryptPasswordService } from 'src/shared/encrypt-password/encrypt-password.service';
import { GenerteEmployeeNumberService } from 'src/shared/generte-employee-number/generte-employee-number.service';
import { GenerateEmailService } from 'src/shared/generate-email/generate-email.service';

@Module({
  controllers: [UserController],
  providers: [UserService, SendEmailService,EncryptPasswordService,GenerteEmployeeNumberService,GenerateEmailService],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserModule, TypeOrmModule],
})
export class UserModule {}
