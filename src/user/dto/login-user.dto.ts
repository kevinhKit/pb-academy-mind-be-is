import {  IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {

    @IsEmail({},{message:"El correo electrónico es inválido."})
    @IsNotEmpty({message:'No envió o dejo vacío el campo correo electrónico.'})
    email: string;


    @IsString({message: 'La contraseña debe ser una cadena de caracteres.'})
    @IsNotEmpty({message:'No envió o dejo vacío el campo contraseña.'})
    password: string;
}
