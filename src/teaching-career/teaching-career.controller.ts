import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeachingCareerService } from './teaching-career.service';
import { CreateTeachingCareerDto } from './dto/create-teaching-career.dto';
import { UpdateTeachingCareerDto } from './dto/update-teaching-career.dto';

@Controller('teaching-career')
export class TeachingCareerController {
  constructor(private readonly teachingCareerService: TeachingCareerService) {}

  @Post()
  create(@Body() createTeachingCareerDto: CreateTeachingCareerDto) {
    return this.teachingCareerService.create(createTeachingCareerDto);
  }

  @Get()
  findAll() {
    return this.teachingCareerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachingCareerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeachingCareerDto: UpdateTeachingCareerDto) {
    return this.teachingCareerService.update(+id, updateTeachingCareerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachingCareerService.remove(+id);
  }
}
