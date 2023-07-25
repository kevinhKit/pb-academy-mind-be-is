import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegionalCenterService } from './regional-center.service';
import { CreateRegionalCenterDto } from './dto/create-regional-center.dto';
import { UpdateRegionalCenterDto } from './dto/update-regional-center.dto';

@Controller('regional-center')
export class RegionalCenterController {
  constructor(private readonly regionalCenterService: RegionalCenterService) {}

  @Post()
  create(@Body() createRegionalCenterDto: CreateRegionalCenterDto) {
    return this.regionalCenterService.create(createRegionalCenterDto);
  }

  @Get()
  findAll() {
    return this.regionalCenterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionalCenterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionalCenterDto: UpdateRegionalCenterDto) {
    return this.regionalCenterService.update(+id, updateRegionalCenterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionalCenterService.remove(+id);
  }
}
