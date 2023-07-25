import { Injectable } from '@nestjs/common';
import { CreateStudentCareerDto } from './dto/create-student-career.dto';
import { UpdateStudentCareerDto } from './dto/update-student-career.dto';

@Injectable()
export class StudentCareerService {
  create(createStudentCareerDto: CreateStudentCareerDto) {
    return 'This action adds a new studentCareer';
  }

  findAll() {
    return `This action returns all studentCareer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentCareer`;
  }

  update(id: number, updateStudentCareerDto: UpdateStudentCareerDto) {
    return `This action updates a #${id} studentCareer`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentCareer`;
  }
}
