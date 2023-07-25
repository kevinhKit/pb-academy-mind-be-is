import { Injectable } from '@nestjs/common';
import { CreateStatePeriodDto } from './dto/create-state-period.dto';
import { UpdateStatePeriodDto } from './dto/update-state-period.dto';

@Injectable()
export class StatePeriodService {
  create(createStatePeriodDto: CreateStatePeriodDto) {
    return 'This action adds a new statePeriod';
  }

  findAll() {
    return `This action returns all statePeriod`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statePeriod`;
  }

  update(id: number, updateStatePeriodDto: UpdateStatePeriodDto) {
    return `This action updates a #${id} statePeriod`;
  }

  remove(id: number) {
    return `This action removes a #${id} statePeriod`;
  }
}
