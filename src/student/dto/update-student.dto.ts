import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

export class UpdateStudentDto extends PartialType(
    PickType(UpdateUserDto, ['email', 'address', 'phone','description']),
  ){


    @IsOptional()
    @IsString({message: "La Fotografia uno, no cumple el formtao requerido."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo Fotografia uno"})
    photoOne: string;

    @IsOptional()
    @IsString({message: "La Fotografia dos, no cumple el formtao requerido."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo Fotografia dos"})
    photoTwo: string;

    @IsOptional()
    @IsString({message: "La Fotografia tres, no cumple el formtao requerido."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo Fotografia tres"})
    photoThree: string;

    @IsOptional()
    @IsNumber({},{message: "La Fotografia actual debe ser de tipo número."})
    @IsNotEmpty({message: "No envió o dejo vacio el campo fotografía actual"})
    currentPhoto: number;


}
