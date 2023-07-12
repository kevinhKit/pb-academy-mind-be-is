import { Allow, IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

  
    @IsString({message: "El DNI debe ser una cadena de texto."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo DNI"})
    dni: string;
    
    @IsString({message: "El primer nombre debe ser una cadena de texto."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo primer nombre"})
    firstName: string;
    
    @IsString({message: "El segundo nombre debe ser una cadena de texto."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo segundo nombre"})
    secondName: string;
    
    @IsString({message: "El primer apellido debe ser una cadena de texto."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo primer apellido"})
    firstLastName: string;
    
    @IsOptional()
    @IsString({message: "El segundo apellido debe ser una cadena de texto."})
    secondLastName: string;
    
    @IsEmail({},{message:"El correo electrónico es inválido."})
    @IsString({message: "El correo electónico debe ser una cadena de texto."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo correo electrónico"})
    email: string;
    
    @IsString({message: "La dirección debe ser una cadena de texto."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo dirección"})
    address: string;
    
    @IsString({message: "El Telefono debe ser una cadena de texto."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo Teléfono"})
    phone: string;
    
    @IsOptional()
    @IsString({message: "La descripción debe ser una cadena de texto."})
    description: string;
    




    @IsOptional()
    @IsString({message: "El photoOne debe ser una cadena de texto."})
    photoOne: string;
    
    @IsOptional()
    @IsString({message: "El photoTwo debe ser una cadena de texto."})
    photoTwo: string;
    
    @IsOptional()
    @IsString({message: "El photoThree debe ser una cadena de texto."})
    photoThree: string;



}
