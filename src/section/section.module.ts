import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';

@Module({
  controllers: [SectionController],
  providers: [SectionService],
  imports:[TypeOrmModule.forFeature([Section])]
})
export class SectionModule {}
