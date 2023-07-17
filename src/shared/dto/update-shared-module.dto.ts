import { PartialType } from '@nestjs/mapped-types';
import { CreateSharedModuleDto } from './create-shared-module.dto';

export class UpdateSharedModuleDto extends PartialType(CreateSharedModuleDto) {}
