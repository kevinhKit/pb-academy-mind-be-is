import { PartialType } from '@nestjs/mapped-types';
import { CreateStatePeriodDto } from './create-state-period.dto';

export class UpdateStatePeriodDto extends PartialType(CreateStatePeriodDto) {}
