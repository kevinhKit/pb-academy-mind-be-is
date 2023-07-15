import { PartialType } from '@nestjs/mapped-types';
import { CreateTeachingCareerDto } from './create-teaching-career.dto';

export class UpdateTeachingCareerDto extends PartialType(CreateTeachingCareerDto) {}
