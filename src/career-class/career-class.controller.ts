import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CareerClassService } from './career-class.service';
import { CreateCareerClassDto } from './dto/create-career-class.dto';
import { UpdateCareerClassDto } from './dto/update-career-class.dto';

@Controller('career-class')
export class CareerClassController {
  constructor(private readonly careerClassService: CareerClassService) {}

  @Post()
  create(@Body() createCareerClassDto: CreateCareerClassDto) {
    return this.careerClassService.create(createCareerClassDto);
  }

  @Get()
  findAll() {
    return this.careerClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.careerClassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCareerClassDto: UpdateCareerClassDto) {
    return this.careerClassService.update(+id, updateCareerClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.careerClassService.remove(+id);
  }
}
