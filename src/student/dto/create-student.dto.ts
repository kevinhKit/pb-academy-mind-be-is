import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsString({ message: 'El dni debe de ser de tipo texto.' })
  @MinLength(11, { message: 'El dni debe tener 11 caracteres.' })
  dni: string;
  @IsString({ message: 'El Nombre debe de ser de tipo texto.' })
  firstName: string;
  @IsOptional()
  @IsString({ message: 'El Nombre debe de ser de tipo texto.' })
  secondName: string;
  @IsString({ message: 'El Nombre debe de ser de tipo texto.' })
  firstLastName: string;
  @IsString({ message: 'El Nombre debe de ser de tipo texto.' })
  secondLastName: string;
  @IsEmail({}, { message: 'Formato de correo incorrecto.' })
  email: string;
  @IsString({ message: 'La dirección debe de ser de tipo texto.' })
  address: string;
  @IsString({ message: 'La carrera debe ser tipo texto.' })
  career: string;
}
