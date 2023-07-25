import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerClassDto } from './create-career-class.dto';

export class UpdateCareerClassDto extends PartialType(CreateCareerClassDto) {}
