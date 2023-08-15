import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalyticService } from './analytic.service';
import { CreateAnalyticDto } from './dto/create-analytic.dto';
import { UpdateAnalyticDto } from './dto/update-analytic.dto';

@Controller('analytic')
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get()
  findAll() {
    return this.analyticService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analyticService.findOne(+id);
  }

  // @Post()
  // create(@Body() createAnalyticDto: CreateAnalyticDto) {
  //   return this.analyticService.create(createAnalyticDto);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAnalyticDto: UpdateAnalyticDto) {
  //   return this.analyticService.update(+id, updateAnalyticDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.analyticService.remove(+id);
  // }
}
