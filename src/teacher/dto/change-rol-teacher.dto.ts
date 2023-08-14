import {
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class ChangeRolTeacherDto {

  @IsNumberString({},{ message: 'El Número de Empleado debe ser de tipo número.' })
  @IsNotEmpty({message: 'No envió o dejo vacio el campo Número de Empleado'})
  employeeNumber: string;

  @IsNumberString({},{ message: 'El Número de Empleado del administrador debe ser de tipo número.' })
  @IsNotEmpty({message: 'No envió o dejo vacio el campo Número de Empleado del administrador'})
  employeeNumberAdmin: string;

}
