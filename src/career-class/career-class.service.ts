import { Injectable } from '@nestjs/common';
import { CreateCareerClassDto } from './dto/create-career-class.dto';
import { UpdateCareerClassDto } from './dto/update-career-class.dto';

@Injectable()
export class CareerClassService {
  create(createCareerClassDto: CreateCareerClassDto) {
    return 'This action adds a new careerClass';
  }

  findAll() {
    return `This action returns all careerClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} careerClass`;
  }

  update(id: number, updateCareerClassDto: UpdateCareerClassDto) {
    return `This action updates a #${id} careerClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} careerClass`;
  }
}
