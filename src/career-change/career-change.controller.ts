import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CareerChangeService } from './career-change.service';
import { CreateCareerChangeDto } from './dto/create-career-change.dto';
import { UpdateCareerChangeDto } from './dto/update-career-change.dto';
import { ReviewCareerChangeDto } from './dto/review-career-change.dto';
import { ReviewCenterChangeDto } from 'src/center-change/dto/review-center-change.dto';

@Controller('career-change')
export class CareerChangeController {
  constructor(private readonly careerChangeService: CareerChangeService) {}

  @Post()
  create(@Body() createCareerChangeDto: CreateCareerChangeDto) {
    return this.careerChangeService.create(createCareerChangeDto);
  }

  @Post('review')
  reviewCareerChangeDto(@Body() reviewCareerChangeDto: ReviewCareerChangeDto) {
    return this.careerChangeService.reviewRequest(reviewCareerChangeDto);
  }

  @Get()
  findAll() {
    return this.careerChangeService.findAll();
  }

  @Get('/:center/:id') 
  findOne(@Param('id') id: string,@Param('center') center: string) {
    return this.careerChangeService.findOne(center,id);
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
