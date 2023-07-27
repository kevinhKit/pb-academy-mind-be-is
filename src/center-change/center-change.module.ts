import { Module } from '@nestjs/common';
import { CenterChangeService } from './center-change.service';
import { CenterChangeController } from './center-change.controller';
import { CenterChange } from './entities/center-change.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CenterChangeController],
  providers: [CenterChangeService],
  imports: [TypeOrmModule.forFeature([CenterChange])],
})
export class CenterChangeModule {}
