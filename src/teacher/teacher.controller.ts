import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { ResetPasswordTeacherDto } from './dto/reset-password-teacher.dto';
import { ChangePasswordTeacherDto } from './dto/change-password-teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Post('login')
  login(@Body() loginTeacherDto: LoginTeacherDto) {
    return this.teacherService.login(loginTeacherDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordTeacherDto: ResetPasswordTeacherDto) {
    return this.teacherService.resetPassword(resetPasswordTeacherDto);
  }

  @Patch('change-password/:id')
  changePassword(@Param('id') id: string, @Body() resetPasswordTeacherDto: ChangePasswordTeacherDto) {
    return this.teacherService.changePassword(id, resetPasswordTeacherDto);
  }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }
}
