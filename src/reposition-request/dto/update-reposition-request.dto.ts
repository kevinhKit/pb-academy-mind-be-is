import { PartialType } from '@nestjs/mapped-types';
import { CreateRepositionRequestDto } from './create-reposition-request.dto';

export class UpdateRepositionRequestDto extends PartialType(CreateRepositionRequestDto) {}
