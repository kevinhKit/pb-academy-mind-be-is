import {  IsEmail, IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class LoginUserDto {

    @IsEmail({},{message:"El correo electrónico es inválido."})
    @IsNotEmpty({message:'No envió o dejo vacío el campo correo electrónico.'})
    email: string;

    @IsNumberString({},{ message: 'El Número de Empleado debe ser de tipo número.' })
    @IsNotEmpty({message: 'No envió o dejo vacio el campo Número de Empleado'})
    employeeNumber: string;

    @IsString({message: 'La contraseña debe ser una cadena de caracteres.'})
    @IsNotEmpty({message:'No envió o dejo vacío el campo contraseña.'})
    password: string;

    
}
