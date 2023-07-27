import { Injectable } from '@nestjs/common';
import { CreateCenterChangeDto } from './dto/create-center-change.dto';
import { UpdateCenterChangeDto } from './dto/update-center-change.dto';

@Injectable()
export class CenterChangeService {
  create(createCenterChangeDto: CreateCenterChangeDto) {
    return 'This action adds a new centerChange';
  }

  findAll() {
    return `This action returns all centerChange`;
  }

  findOne(id: number) {
    return `This action returns a #${id} centerChange`;
  }

  update(id: number, updateCenterChangeDto: UpdateCenterChangeDto) {
    return `This action updates a #${id} centerChange`;
  }

  remove(id: number) {
    return `This action removes a #${id} centerChange`;
  }
}
