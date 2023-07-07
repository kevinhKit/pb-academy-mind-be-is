import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class CreateTeacherDto {
  @IsString({ message: 'El dni debe de ser de tipo texto.' })
  @MinLength(11, { message: 'El dni debe tener 11 caracteres.' })
  dni: string;
  @IsString({ message: 'El Nombre debe de ser de tipo texto.' })
  firstName: string;
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
  @IsPhoneNumber('HN', { message: 'Número de teléfono incorrecto.' })
  phone: string;
  @IsBoolean()
  isTeacher: boolean;
  @IsBoolean()
  isBoss: boolean;
  @IsBoolean()
  isCoordinator: boolean;
  @IsString()
  video: string;
}
