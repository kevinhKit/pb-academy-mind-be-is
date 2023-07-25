import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';

@Module({
  controllers: [BuildingController],
  providers: [BuildingService],
  imports: [TypeOrmModule.forFeature([Building])]
})
export class BuildingModule {}
