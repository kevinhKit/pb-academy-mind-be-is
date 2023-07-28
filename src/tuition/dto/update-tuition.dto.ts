import { PartialType } from '@nestjs/mapped-types';
import { CreateTuitionDto } from './create-tuition.dto';

export class UpdateTuitionDto extends PartialType(CreateTuitionDto) {}
