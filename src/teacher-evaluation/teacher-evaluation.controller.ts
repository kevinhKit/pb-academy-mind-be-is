import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeacherEvaluationService } from './teacher-evaluation.service';
import { CreateTeacherEvaluationDto } from './dto/create-teacher-evaluation.dto';
import { UpdateTeacherEvaluationDto } from './dto/update-teacher-evaluation.dto';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Period } from 'src/period/entities/period.entity';
import { Class } from 'src/class/entities/class.entity';

@Controller('teacher-evaluation')
export class TeacherEvaluationController {
  constructor(
    private readonly teacherEvaluationService: TeacherEvaluationService,
  ) {}

  @Post()
  create(@Body() createTeacherEvaluationDto: CreateTeacherEvaluationDto) {
    return this.teacherEvaluationService.create(createTeacherEvaluationDto);
  }

  @Get('teachers/:id')
  findOne(@Param('id') id: string) {
    return this.teacherEvaluationService.findOne(id);
  }

  @Get('teachers-notes/:idTeacher/:idPeriod/:idClass')
  findTeacherNotes(
    @Param('idTeacher') idTeacher: Teacher,
    @Param('idPeriod') idPeriod: Period,
    @Param('idClass') idClass: Class,
  ) {
    return this.teacherEvaluationService.findTeacherNotes(
      idTeacher,
      idPeriod,
      idClass,
    );
  }

  @Get()
  findAll() {
    return this.teacherEvaluationService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeacherEvaluationDto: UpdateTeacherEvaluationDto,
  ) {
    return this.teacherEvaluationService.update(
      +id,
      updateTeacherEvaluationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherEvaluationService.remove(+id);
  }
}
