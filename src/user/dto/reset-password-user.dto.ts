import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, Matches, IsNotEmpty } from 'class-validator';

export class ResetPasswordUserDto extends PartialType(CreateUserDto) {

  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}$/, {message: "La contraseña no mide el minimo de seguridad."})
  @IsString({ message: 'La contraseña debe ser una cadena de caracteres.' })
  @IsNotEmpty({message:"No envió o dejo vacia la contraseña."})
  password: string;

    
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}$/, {message: "La contraseña nueva no mide el minimo de seguridad."})
  @IsString({ message: 'La nueva contraseña debe ser una cadena de caracteres.' })
  @IsNotEmpty({message:"No envió o dejo vacia la nueva contraseña."})
  newPassword?: string;


}
