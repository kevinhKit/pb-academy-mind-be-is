import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalyticDto } from './create-analytic.dto';

export class UpdateAnalyticDto extends PartialType(CreateAnalyticDto) {}
