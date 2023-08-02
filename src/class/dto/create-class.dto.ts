import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Class } from '../entities/class.entity';
import { Career } from 'src/career/entities/career.entity';

export class CreateClassDto {
  @IsString({ message: 'El codigo de la carrera debe ser de tipo texto' })
  careerId: Career;

  @IsString({ message: 'El codigo de la clase debe ser de tipo texto' })
  code: string;

  @IsString({ message: 'El nombre de la clase debe ser de tipo texto' })
  name: string;

  @IsString({ message: 'Las unidades valorativas deben ser de tipo texto' })
  valueUnits: string;

  @IsOptional()
  @IsNumber(
    {},
    { each: true, message: 'Los requisitos deben ser un arreglo de numeros' },
  )
  requisites: Class[];
}
