import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { SharedModule } from 'src/shared/shared.module';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  imports: [TypeOrmModule.forFeature([Class, RequirementClass]), SharedModule],
})
export class ClassModule {}
