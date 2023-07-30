import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePeriodDto } from './create-period.dto';

export class UpdatePeriodDto extends PartialType(CreatePeriodDto) {
  @IsOptional()
  @IsBoolean({ message: 'La fecha de reposicion debe ser de tipo booleano' })
  replacementPaymentDate: boolean;

  @IsOptional()
  @IsBoolean({
    message:
      'La fecha de cancelaciones excepcionales debe ser de tipo booleano',
  })
  exceptionalCancellationDate: boolean;
}
