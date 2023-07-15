import { Injectable } from '@nestjs/common';
import { CreateTeachingCareerDto } from './dto/create-teaching-career.dto';
import { UpdateTeachingCareerDto } from './dto/update-teaching-career.dto';

@Injectable()
export class TeachingCareerService {
  create(createTeachingCareerDto: CreateTeachingCareerDto) {
    return 'This action adds a new teachingCareer';
  }

  findAll() {
    return `This action returns all teachingCareer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teachingCareer`;
  }

  update(id: number, updateTeachingCareerDto: UpdateTeachingCareerDto) {
    return `This action updates a #${id} teachingCareer`;
  }

  remove(id: number) {
    return `This action removes a #${id} teachingCareer`;
  }
}
