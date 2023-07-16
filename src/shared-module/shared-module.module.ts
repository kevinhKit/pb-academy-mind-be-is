import { Module } from '@nestjs/common';
import { GenerateTokenService } from './generate-token/generate-token.service';
import { SendEmailService } from './send-email/send-email.service';
import { EncryptPasswordService } from './encrypt-password/encrypt-password.service';

@Module({
  controllers: [],
  providers: [GenerateTokenService, SendEmailService, EncryptPasswordService]
})
export class SharedModuleModule {}
