import { Module } from '@nestjs/common';
import { CenterCareerService } from './center-career.service';
import { CenterCareerController } from './center-career.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CenterCareer } from './entities/center-career.entity';

@Module({
  controllers: [CenterCareerController],
  providers: [CenterCareerService],
  imports: [TypeOrmModule.forFeature([CenterCareer])],
})
export class CenterCareerModule {}
