import { IsOptional, IsString } from "class-validator";


export class CreateUserDto {

    
    @IsString({message: "El DNI debe ser una cadena de texto."})
    dni: string;
    
    @IsString({message: "El primer nombre debe ser una cadena de texto."})
    firstName: string;
    
    @IsString({message: "El segundo nombre debe ser una cadena de texto."})
    secondName: string;
    
    @IsString({message: "El primer apellido debe ser una cadena de texto."})
    firstLastName: string;
    
    @IsString({message: "El segundo apellido debe ser una cadena de texto."})
    secondLastName: string;
    
    @IsString({message: "El correo electónico debe ser una cadena de texto."})
    email: string;
    
    @IsString({message: "La dirección debe ser una cadena de texto."})
    address: string;
    
    @IsString({message: "El Telefono debe ser una cadena de texto."})
    phone: string;
    
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
