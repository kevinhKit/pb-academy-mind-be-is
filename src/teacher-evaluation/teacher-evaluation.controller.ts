import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeacherEvaluationService } from './teacher-evaluation.service';
import { CreateTeacherEvaluationDto } from './dto/create-teacher-evaluation.dto';
import { UpdateTeacherEvaluationDto } from './dto/update-teacher-evaluation.dto';

@Controller('teacher-evaluation')
export class TeacherEvaluationController {
  constructor(private readonly teacherEvaluationService: TeacherEvaluationService) {}

  @Post()
  create(@Body() createTeacherEvaluationDto: CreateTeacherEvaluationDto) {
    return this.teacherEvaluationService.create(createTeacherEvaluationDto);
  }

  @Get()
  findAll() {
    return this.teacherEvaluationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherEvaluationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherEvaluationDto: UpdateTeacherEvaluationDto) {
    return this.teacherEvaluationService.update(+id, updateTeacherEvaluationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherEvaluationService.remove(+id);
  }
}
