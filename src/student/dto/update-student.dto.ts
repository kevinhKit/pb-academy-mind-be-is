import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto{

    @IsOptional()        
    @IsString({message: "El coreo electrónico debe ser una cadea da caracteres"})
    email: string;
    @IsOptional()        
    @IsString({message: "La Contraseña debe ser una cadea da caracteres"})
    password: string;
    @IsOptional()        
    @IsString({message: "La dirección debe ser una cadea da caracteres"})
    address: string;
    @IsOptional()        
    @IsString({message: "El Celuar debe ser una cadea da caracteres"})
    phone: string;
    @IsOptional()        
    @IsString({message: "La descripción debe ser una cadea da caracteres"})
    description: string;
    @IsOptional()        
    @IsString({message: "La Fotografia uno, no cumple el formtao requerido"})
    photoOne: string;
    @IsOptional()        
    @IsString({message: "La Fotografia dos, no cumple el formtao requerido"})
    photoTwo: string;
    @IsOptional()        
    @IsString({message: "La Fotografia tres, no cumple el formtao requerido"})
    photoThree: string;





}
