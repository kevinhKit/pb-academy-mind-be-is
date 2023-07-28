import { PartialType } from '@nestjs/mapped-types';
import { CreateExceptionalCancellationDto } from './create-exceptional-cancellation.dto';

export class UpdateExceptionalCancellationDto extends PartialType(CreateExceptionalCancellationDto) {}
