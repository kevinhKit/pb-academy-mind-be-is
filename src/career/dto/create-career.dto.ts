import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

export class CreateCareerDto {
  @IsString({
    each: true,
    message: 'Los centros regionales deben de ser un arreglo de strings',
  })
  @IsNotEmpty({ message: 'El id del centro regional es un campo obligatorio.' })
  centerId: RegionalCenter[];

  @IsString({ message: 'El id de la Carrera debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el id de la Carrera' })
  id: string;

  @IsString({ message: 'El nombre de la Carrera debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el nombre de la Carrera' })
  name: string;

  @IsString({ message: 'El código de la carrera debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el Código de la Carrera' })
  raceCode: string;

  @IsOptional()
  @IsNumberString(
    {},
    { message: 'LA nota minima de ingreso debe ser de tipo Numero.' },
  )
  @IsNotEmpty({
    message: 'No envió o dejo vacio el campo no ta minima de ingreso',
  })
  minimumIncomeValue: string;
}
