import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreatePeriodDto } from './create-period.dto';

export class UpdatePeriodCancelationDto extends PartialType(CreatePeriodDto) {
  @IsString({
    message: 'El inicio de cancelaciones excepcionales debe ser una fecha',
  })
  exceptionalCancelationStarts: string;

  @IsString({
    message: 'El inicio de cancelaciones excepcionales debe ser una fecha',
  })
  exceptionalCancelationEnds: string;
}
