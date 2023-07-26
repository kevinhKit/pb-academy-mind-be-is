import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerChangeDto } from './create-career-change.dto';

export class UpdateCareerChangeDto extends PartialType(CreateCareerChangeDto) {}
