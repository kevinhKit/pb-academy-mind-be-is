import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { StatePeriod } from 'src/state-period/entities/state-period.entity';

export class CreatePeriodDto {
  @IsNumber({}, { message: 'El id del estado periodo debe ser un numero' })
  idStatePeriod: StatePeriod;

  @IsNumber({}, { message: 'El numbero del periodo debe ser un numero' })
  numberPeriod: number;

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
  @IsNumber({}, { message: 'La fecha debe ser un numero' })
  year: number;
}
