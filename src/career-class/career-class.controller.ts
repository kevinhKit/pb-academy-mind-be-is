import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CareerClassService } from './career-class.service';
import { CreateCareerClassDto } from './dto/create-career-class.dto';
import { UpdateCareerClassDto } from './dto/update-career-class.dto';
import { Career } from 'src/career/entities/career.entity';
import { Student } from 'src/student/entities/student.entity';

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

  @Get('requirements/:id')
  findClassRequirements(
    @Param('id') id: Career,
    @Query('studentId') studentId: Student,
  ) {
    return this.careerClassService.findClassRequirements(id, studentId);
  }

  @Get('department/:id')
  findClassDepartment(@Param('id') id: Career) {
    return this.careerClassService.findClassDepartment(id);
  }

  @Get(':id')
  findOne(@Param('id') id: Career) {
    return this.careerClassService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCareerClassDto: UpdateCareerClassDto,
  ) {
    return this.careerClassService.update(+id, updateCareerClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.careerClassService.remove(+id);
  }
}
