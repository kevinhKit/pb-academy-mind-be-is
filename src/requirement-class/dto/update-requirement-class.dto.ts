import { PartialType } from '@nestjs/mapped-types';
import { CreateRequirementClassDto } from './create-requirement-class.dto';

export class UpdateRequirementClassDto extends PartialType(CreateRequirementClassDto) {}
