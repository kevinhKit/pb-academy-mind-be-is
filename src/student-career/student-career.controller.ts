import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentCareerService } from './student-career.service';
import { CreateStudentCareerDto } from './dto/create-student-career.dto';
import { UpdateStudentCareerDto } from './dto/update-student-career.dto';

@Controller('student-career')
export class StudentCareerController {
  constructor(private readonly studentCareerService: StudentCareerService) {}

  @Post()
  create(@Body() createStudentCareerDto: CreateStudentCareerDto) {
    return this.studentCareerService.create(createStudentCareerDto);
  }

  @Get()
  findAll() {
    return this.studentCareerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentCareerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentCareerDto: UpdateStudentCareerDto) {
    return this.studentCareerService.update(+id, updateStudentCareerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentCareerService.remove(+id);
  }
}
