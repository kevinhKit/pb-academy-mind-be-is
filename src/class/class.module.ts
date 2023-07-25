import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  imports: [TypeOrmModule.forFeature([Class])]
})
export class ClassModule {}
