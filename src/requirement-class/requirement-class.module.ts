import { Module } from '@nestjs/common';
import { RequirementClassService } from './requirement-class.service';
import { RequirementClassController } from './requirement-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequirementClass } from './entities/requirement-class.entity';

@Module({
  controllers: [RequirementClassController],
  providers: [RequirementClassService],
  imports: [TypeOrmModule.forFeature([RequirementClass])]
})
export class RequirementClassModule {}
