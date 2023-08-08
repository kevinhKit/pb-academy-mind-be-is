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

  @Get('class-period/:id')
  findClasses(@Param('id') id: Class, @Query('period') periodId?: Period) {
    return this.sectionService.findClasses(id, periodId);
  }

  @Get('waiting-list-sections/:id')
  findWaitingListSections(@Param('id') id: Career) {
    return this.sectionService.findWaitingListSections(id);
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
