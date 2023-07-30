import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class CreateStatePeriodDto {
  @IsOptional()
  @IsString({ message: 'El estado del periodo debe ser de tipo texto' })
  name: string;

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
