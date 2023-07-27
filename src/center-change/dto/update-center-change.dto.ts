import { PartialType } from '@nestjs/mapped-types';
import { CreateCenterChangeDto } from './create-center-change.dto';

export class UpdateCenterChangeDto extends PartialType(CreateCenterChangeDto) {}
