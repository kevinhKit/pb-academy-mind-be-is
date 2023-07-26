import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CareerChangeService } from './career-change.service';
import { CreateCareerChangeDto } from './dto/create-career-change.dto';
import { UpdateCareerChangeDto } from './dto/update-career-change.dto';

@Controller('career-change')
export class CareerChangeController {
  constructor(private readonly careerChangeService: CareerChangeService) {}

  @Post()
  create(@Body() createCareerChangeDto: CreateCareerChangeDto) {
    return this.careerChangeService.create(createCareerChangeDto);
  }

  @Get()
  findAll() {
    return this.careerChangeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.careerChangeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCareerChangeDto: UpdateCareerChangeDto) {
    return this.careerChangeService.update(+id, updateCareerChangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.careerChangeService.remove(+id);
  }
}
