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
import { TuitionService } from './tuition.service';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { UpdateTuitionDto } from './dto/update-tuition.dto';
import { Section } from 'src/section/entities/section.entity';
import { Student } from 'src/student/entities/student.entity';
import { Period } from 'src/period/entities/period.entity';
import { Career } from 'src/career/entities/career.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

@Controller('tuition')
export class TuitionController {
  constructor(private readonly tuitionService: TuitionService) {}

  @Post()
  create(@Body() createTuitionDto: CreateTuitionDto) {
    return this.tuitionService.create(createTuitionDto);
  }

  @Get()
  findAll() {
    return this.tuitionService.findAll();
  }

  @Get('tuition-validation/:id')
  tuitionValidation(@Param('id') id: Student) {
    return this.tuitionService.tuitionValidation(id);
  }

  @Get('teacher-notes/:id')
  tuitionNotesByDepartment(
    @Param('id') id: Career,
    @Query('center') centerId: RegionalCenter,
  ) {
    return this.tuitionService.tuitionNotesByDepartment(id, centerId);
  }

  @Get('teacher-grades/:id')
  tuitionGradesByTeacher(
    @Param('id') id: Teacher,
    @Query('departmentId') departmentId: Career,
  ) {
    return this.tuitionService.tuitionGradesByTeacher(id, departmentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tuitionService.findOne(id);
  }

  @Get('section/:id')
  findClasses(@Param('id') id: Section) {
    return this.tuitionService.findSection(id);
  }

  @Get('grades-ready/:id')
  sendEmailGrades(@Param('id') id: Section) {
    return this.tuitionService.sendEmailGrades(id);
  }

  @Get('waiting-section/:id')
  findWaitingSection(@Param('id') id: Section) {
    return this.tuitionService.findWaitingSection(id);
  }

  @Get('student/:id')
  findStudent(@Param('id') id: Student, @Query('periodId') periodId?: Period) {
    return this.tuitionService.findStudent(id, periodId);
  }

  @Get('student-grades/:id')
  findStudentGrades(@Param('id') id: Student) {
    return this.tuitionService.findStudentGrades(id);
  }

  @Get('student-history/:id')
  findStudentHistoryGrades(@Param('id') id: Student) {
    return this.tuitionService.findStudentHistoryGrades(id);
  }

  @Get('registration/:id')
  registration(@Param('id') id: Student) {
    return this.tuitionService.registration(id);
  }

  @Get('period-students/:id')
  findStudents(
    @Param('id') id: Period,
    @Query('department') deparmentId: Career,
    @Query('center') centerId: RegionalCenter,
  ) {
    return this.tuitionService.findStudentsPeriod(id, deparmentId, centerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTuitionDto: UpdateTuitionDto) {
    return this.tuitionService.update(id, updateTuitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tuitionService.remove(id);
  }
}
