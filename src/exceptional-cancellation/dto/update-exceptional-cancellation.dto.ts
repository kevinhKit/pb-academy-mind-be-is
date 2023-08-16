import { PartialType } from '@nestjs/mapped-types';
import { CreateExceptionalCancellationDto } from './create-exceptional-cancellation.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { cancelationStatus } from '../entities/exceptional-cancellation.entity';

export class UpdateExceptionalCancellationDto extends PartialType(
  CreateExceptionalCancellationDto,
) {
  @IsNotEmpty()
  @IsEnum(cancelationStatus, {
    message: 'El estado de la solicitud debe ser de tipo texto',
  })
  status: cancelationStatus;
}
