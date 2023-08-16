import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentPasswordDto } from './dto/update-student-password.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { ResetPasswordStudentDto } from './dto/reset-password-student.dto';
import { ChangePasswordStudentDto } from './dto/change-password-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Post('multiple')
  createMultiple(@Body() createStudentDto: CreateStudentDto[]) {
    return this.studentService.createMultiple(createStudentDto);
  }

  @Post('login')
  login(@Body() loginStudentDto: LoginStudentDto) {
    return this.studentService.login(loginStudentDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordStudentDto: ResetPasswordStudentDto) {
    return this.studentService.resetPassword(resetPasswordStudentDto);
  }
  
  @Patch('change-password/:id')
  changePassword(@Param('id') id: string, @Body() changePasswordStudentDto: ChangePasswordStudentDto) {
    return this.studentService.changePassword(id, changePasswordStudentDto);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Get('center/:id')
  findAllStudentByRegionalCenter(@Param('id') id: string) {
    return this.studentService.findAllStudentByRegionalCenter(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
