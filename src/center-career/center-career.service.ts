import { Injectable } from '@nestjs/common';
import { CreateCenterCareerDto } from './dto/create-center-career.dto';
import { UpdateCenterCareerDto } from './dto/update-center-career.dto';

@Injectable()
export class CenterCareerService {
  create(createCenterCareerDto: CreateCenterCareerDto) {
    return 'This action adds a new centerCareer';
  }

  findAll() {
    return `This action returns all centerCareer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} centerCareer`;
  }

  update(id: number, updateCenterCareerDto: UpdateCenterCareerDto) {
    return `This action updates a #${id} centerCareer`;
  }

  remove(id: number) {
    return `This action removes a #${id} centerCareer`;
  }
}
