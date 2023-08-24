import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { CreatePeriodDto } from './create-period.dto';
import { StatePeriod } from 'src/state-period/entities/state-period.entity';

export class UpdatePeriodDto extends PartialType(CreatePeriodDto) {
  @IsOptional()
  @IsNumber({}, { message: 'El id del estado periodo debe ser un numero' })
  idStatePeriod: StatePeriod;

  @IsOptional()
  @IsBoolean({ message: 'La fecha de reposicion debe ser de tipo booleano' })
  replacementPaymentDate: boolean;

  @IsOptional()
  @IsBoolean({
    message:
      'La fecha de cancelaciones excepcionales debe ser de tipo booleano',
  })
  exceptionalCancellationDate: boolean;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'La fecha debe ser tipo fecha',
    },
  )
  registrationDate: Date;
}
