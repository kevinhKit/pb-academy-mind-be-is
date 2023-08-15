import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CenterChangeService } from './center-change.service';
import { CreateCenterChangeDto } from './dto/create-center-change.dto';
import { UpdateCenterChangeDto } from './dto/update-center-change.dto';
import { ReviewCenterChangeDto } from './dto/review-center-change.dto';

@Controller('center-change')
export class CenterChangeController {
  constructor(private readonly centerChangeService: CenterChangeService) {}

  @Post()
  create(@Body() createCenterChangeDto: CreateCenterChangeDto) {
    return this.centerChangeService.create(createCenterChangeDto);
  }

  @Post('review')
  reviewCenterChange(@Body() reviewCenterChangeDto: ReviewCenterChangeDto) {
    return this.centerChangeService.reviewRequest(reviewCenterChangeDto);
  }

  @Get()
  findAll() {
    return this.centerChangeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.centerChangeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCenterChangeDto: UpdateCenterChangeDto) {
    return this.centerChangeService.update(+id, updateCenterChangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.centerChangeService.remove(+id);
  }
}
