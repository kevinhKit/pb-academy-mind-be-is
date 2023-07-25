import { PartialType } from '@nestjs/mapped-types';
import { CreateRegionalCenterDto } from './create-regional-center.dto';

export class UpdateRegionalCenterDto extends PartialType(CreateRegionalCenterDto) {}
