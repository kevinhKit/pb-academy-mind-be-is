import { Injectable } from '@nestjs/common';
import { CreateCareerChangeDto } from './dto/create-career-change.dto';
import { UpdateCareerChangeDto } from './dto/update-career-change.dto';

@Injectable()
export class CareerChangeService {
  create(createCareerChangeDto: CreateCareerChangeDto) {
    return 'This action adds a new careerChange';
  }

  findAll() {
    return `This action returns all careerChange`;
  }

  findOne(id: number) {
    return `This action returns a #${id} careerChange`;
  }

  update(id: number, updateCareerChangeDto: UpdateCareerChangeDto) {
    return `This action updates a #${id} careerChange`;
  }

  remove(id: number) {
    return `This action removes a #${id} careerChange`;
  }
}
