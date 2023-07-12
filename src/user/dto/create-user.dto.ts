import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    
    @IsNotEmpty({message: "No envió o dejo vacio el campo DNI"})
    @IsString({message: "El DNI debe ser una cadena de texto."})
    dni: string;
    
    @IsNotEmpty({message: "No envió o dejo vacio el campo primer nombre"})
    @IsString({message: "El primer nombre debe ser una cadena de texto."})
    firstName: string;
    
    @IsNotEmpty({message: "No envió o dejo vacio el campo segundo nombre"})
    @IsString({message: "El segundo nombre debe ser una cadena de texto."})
    secondName: string;
    
    @IsNotEmpty({message: "No envió o dejo vacio el campo primer apellido"})
    @IsString({message: "El primer apellido debe ser una cadena de texto."})
    firstLastName: string;
    
    @IsNotEmpty({message: "No envió o dejo vacio el campo segundo apellido"})
    @IsString({message: "El segundo apellido debe ser una cadena de texto."})
    secondLastName: string;
    
    @IsNotEmpty({message: "No envió o dejo vacio el campo correo electrónico"})
    @IsString({message: "El correo electónico debe ser una cadena de texto."})
    email: string;
    
    @IsNotEmpty({message: "No envió o dejo vacio el campo dirección"})
    @IsString({message: "La dirección debe ser una cadena de texto."})
    address: string;
    
    @IsNotEmpty({message: "No envió o dejo vacio el campo Teléfono"})
    @IsString({message: "El Telefono debe ser una cadena de texto."})
    phone: string;
    
    @IsNotEmpty({message: "No envió o dejo vacio el campo descripción"})
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
