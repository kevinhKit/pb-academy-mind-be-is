import { PartialType } from '@nestjs/mapped-types';
import { CreateCenterCareerDto } from './create-center-career.dto';

export class UpdateCenterCareerDto extends PartialType(CreateCenterCareerDto) {}
