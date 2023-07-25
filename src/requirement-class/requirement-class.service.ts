import { Injectable } from '@nestjs/common';
import { CreateRequirementClassDto } from './dto/create-requirement-class.dto';
import { UpdateRequirementClassDto } from './dto/update-requirement-class.dto';

@Injectable()
export class RequirementClassService {
  create(createRequirementClassDto: CreateRequirementClassDto) {
    return 'This action adds a new requirementClass';
  }

  findAll() {
    return `This action returns all requirementClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requirementClass`;
  }

  update(id: number, updateRequirementClassDto: UpdateRequirementClassDto) {
    return `This action updates a #${id} requirementClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} requirementClass`;
  }
}
