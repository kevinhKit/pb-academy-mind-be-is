import { IsArray, IsEnum, IsIn, IsNotEmpty, IsString } from "class-validator";


enum daysClass {
    LU = 'LU',
    MA = 'MA',
    MI = 'MI',
    JU = 'JU',
    SA = 'SA',
    DO = 'DO',
  }
  
export class CreateSectionDto {


    @IsString({ message: 'El id del periodo debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el id del periodo"})
    idPeriod: string;


    @IsString({ message: 'El código de la sección debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el código de la sección"})
    codeSection: string;


    @IsString({ message: 'El id de la clase debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el id de la clase"})
    idClass: string;

    @IsString({ message: 'El id del docente debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el id del docente"})
    idTeacher: string;

    @IsString({ message: 'El Numero de cupos debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo número de cupos"})
    space: string;

    @IsArray()
    @IsIn(["Lu","Ma","Mi","Ju","Vi","Sa","Do"], { each: true , message: "No se ha enviado dias de la semana validos" })
    days: daysClass[];

    @IsString({ message: 'El Aula debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo aula"})
    idClassroom: string;

    @IsString({ message: 'La hora debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo hora"})
    hour: string;

}
