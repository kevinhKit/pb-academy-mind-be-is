import { IsBoolean, IsString, IsOptional, IsEnum } from 'class-validator';
import { Rol } from '../entities/state-period.entity';

export class CreateStatePeriodDto {
  @IsOptional()
  @IsEnum(Rol, { message: 'El estado del periodo debe ser de tipo texto' })
  name: Rol;

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
