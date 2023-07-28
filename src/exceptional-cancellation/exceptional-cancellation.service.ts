import { Injectable } from '@nestjs/common';
import { CreateExceptionalCancellationDto } from './dto/create-exceptional-cancellation.dto';
import { UpdateExceptionalCancellationDto } from './dto/update-exceptional-cancellation.dto';

@Injectable()
export class ExceptionalCancellationService {
  create(createExceptionalCancellationDto: CreateExceptionalCancellationDto) {
    return 'This action adds a new exceptionalCancellation';
  }

  findAll() {
    return `This action returns all exceptionalCancellation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exceptionalCancellation`;
  }

  update(id: number, updateExceptionalCancellationDto: UpdateExceptionalCancellationDto) {
    return `This action updates a #${id} exceptionalCancellation`;
  }

  remove(id: number) {
    return `This action removes a #${id} exceptionalCancellation`;
  }
}
