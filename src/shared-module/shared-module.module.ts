import { Module } from '@nestjs/common';
import { SharedModuleService } from './shared-module.service';
import { SharedModuleController } from './shared-module.controller';

@Module({
  controllers: [SharedModuleController],
  providers: [SharedModuleService]
})
export class SharedModuleModule {}
