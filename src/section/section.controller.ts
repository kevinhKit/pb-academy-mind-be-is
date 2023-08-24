import {
  Controller,
  Query,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Period } from 'src/period/entities/period.entity';
import { Class } from 'src/class/entities/class.entity';
import { Career } from 'src/career/entities/career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  findAll() {
    return this.sectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionService.findOne(id);
  }

  @Get('teacher/:id')
  findTeacher(@Param('id') id: Teacher, @Query('periodId') periodId?: Period) {
    return this.sectionService.findTeacher(id, periodId);
  }

  @Get('teacher-grades/:id')
  findTeacherGrades(@Param('id') id: Teacher) {
    return this.sectionService.findTeacherGrades(id);
  }

  @Get('class-period/:id')
  findClasses(
    @Param('id') id: Class,
    @Query('center') centerId: RegionalCenter,
    @Query('period') periodId?: Period,
  ) {
    return this.sectionService.findClasses(id, periodId, centerId);
  }

  @Get('department/:id')
  findSectionsByDepartment(
    @Param('id') id: Career,
    @Query('center') centerId: RegionalCenter,
  ) {
    return this.sectionService.findSectionsByDepartment(id, centerId);
  }

  @Get('on-grades/:id')
  findSectionsOnGrades(
    @Param('id') id: Career,
    @Query('center') centerId: RegionalCenter,
  ) {
    return this.sectionService.findSectionsOnGrades(id, centerId);
  }

  @Get('waiting-list-sections/:id')
  findWaitingListSections(
    @Param('id') id: Career,
    @Query('center') centerId: RegionalCenter,
  ) {
    return this.sectionService.findWaitingListSections(id, centerId);
  }

  @Get('period-charge/:id')
  findPeriodCharge(
    @Param('id') id: Career,
    @Query('center') centerId: RegionalCenter,
    @Query('period') periodId: Period,
  ) {
    return this.sectionService.findPeriodCharge(id, centerId, periodId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionService.update(id, updateSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionService.remove(id);
  }
}
