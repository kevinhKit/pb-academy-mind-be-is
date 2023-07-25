import { Injectable } from '@nestjs/common';
import { CreateRegionalCenterDto } from './dto/create-regional-center.dto';
import { UpdateRegionalCenterDto } from './dto/update-regional-center.dto';

@Injectable()
export class RegionalCenterService {
  create(createRegionalCenterDto: CreateRegionalCenterDto) {
    return 'This action adds a new regionalCenter';
  }

  findAll() {
    return `This action returns all regionalCenter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} regionalCenter`;
  }

  update(id: number, updateRegionalCenterDto: UpdateRegionalCenterDto) {
    return `This action updates a #${id} regionalCenter`;
  }

  remove(id: number) {
    return `This action removes a #${id} regionalCenter`;
  }
}
