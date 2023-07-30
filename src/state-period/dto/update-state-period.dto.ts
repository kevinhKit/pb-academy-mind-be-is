import { PartialType } from '@nestjs/mapped-types';
import { CreateStatePeriodDto } from './create-state-period.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateStatePeriodDto extends PartialType(CreateStatePeriodDto) {
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
