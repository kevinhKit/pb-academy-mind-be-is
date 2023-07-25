import { Module } from '@nestjs/common';
import { RegionalCenterService } from './regional-center.service';
import { RegionalCenterController } from './regional-center.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionalCenter } from './entities/regional-center.entity';

@Module({
  controllers: [RegionalCenterController],
  providers: [RegionalCenterService],
  imports: [TypeOrmModule.forFeature([RegionalCenter])]
})
export class RegionalCenterModule {}
