import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CenterCareerService } from './center-career.service';
import { CreateCenterCareerDto } from './dto/create-center-career.dto';
import { UpdateCenterCareerDto } from './dto/update-center-career.dto';

@Controller('center-career')
export class CenterCareerController {
  constructor(private readonly centerCareerService: CenterCareerService) {}

  @Post()
  create(@Body() createCenterCareerDto: CreateCenterCareerDto) {
    return this.centerCareerService.create(createCenterCareerDto);
  }

  @Get()
  findAll() {
    return this.centerCareerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.centerCareerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCenterCareerDto: UpdateCenterCareerDto) {
    return this.centerCareerService.update(+id, updateCenterCareerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.centerCareerService.remove(+id);
  }
}
