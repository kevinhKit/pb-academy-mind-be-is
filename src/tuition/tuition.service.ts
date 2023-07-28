import { Injectable } from '@nestjs/common';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { UpdateTuitionDto } from './dto/update-tuition.dto';

@Injectable()
export class TuitionService {
  create(createTuitionDto: CreateTuitionDto) {
    return 'This action adds a new tuition';
  }

  findAll() {
    return `This action returns all tuition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tuition`;
  }

  update(id: number, updateTuitionDto: UpdateTuitionDto) {
    return `This action updates a #${id} tuition`;
  }

  remove(id: number) {
    return `This action removes a #${id} tuition`;
  }
}
