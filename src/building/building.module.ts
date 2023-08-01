import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

@Module({
  controllers: [BuildingController],
  providers: [BuildingService],
  imports: [TypeOrmModule.forFeature([Building,RegionalCenter])]
})
export class BuildingModule {}
