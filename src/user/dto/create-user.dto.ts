import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

  
    @Matches(/^(?:\d{13}|[0-9]{4}-\d{4}-\d{5})$/, {message: "EL DNI no cumple el formato: XXXX-XXXX-XXXXX Ó XXXXXXXXXXXXX"})
    @MaxLength(13, {message: 'El DNI debe tener maximo 15 caracteres'})
    @MinLength(11, { message: 'El DNI debe tener minimo 13 caracteres.' })
    @IsString({ message: 'El DNI debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campos DNI"})
    dni: string;
    
    @IsString({ message: 'El Primer Nombre debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo Primer Nombre"})
    firstName: string;
    
    @IsString({ message: 'El Segundo Nombre debe ser de tipo texto.' })
    @IsOptional()
    secondName: string;
    
    @IsString({ message: 'El Segundo Apellido debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo Primer Apellido"})
    firstLastName: string;
    
    @IsString({ message: 'El Segundo Apellido debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo Segundo Apellido"})
    secondLastName: string;
    
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/, { message: 'El correo electrónico no cumple el formato.' })
    @IsNotEmpty({message:"No envió o dejo vacio el campo correo electrónico."})
    email: string;

    @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}$/, {message: "La contraseña no mide el minimo de seguridad."})
    @IsString({ message: 'La contraseña debe ser una cadena de caracteres.' })
    @IsNotEmpty({message:"No envió o dejo vacia la contraseña."})
    password: string;
    
    @IsString({ message: 'La dirección debe ser de tipo texto.' })
    @IsNotEmpty({message:"No envió o dejo vacia la dirección."})
    address: string;
    
    @IsPhoneNumber('HN', { message: 'Número de teléfono incorrecto.' })
    @IsString({message: "El Telefono debe ser una cadena de texto."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo Teléfono"})
    phone: string;
    
    @IsOptional()
    @IsString({message: "La descripción debe ser una cadena de texto."})
    description: string;
    





}