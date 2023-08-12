import { IsNotEmpty, IsString } from "class-validator";

export class CreateCareerChangeDto {

    @IsString({ message: 'El número de cuenta debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo número de cuenta"})
    accountNumber: string;

    @IsString({ message: 'El id de la carrera debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo id de carrera"})
    idCareer: string;

    @IsString({ message: 'La justificación debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo justificación"})
    justification: string;

    @IsString({ message: 'el pdf de justificación debe ser una cadena de texto debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo justificación de pdf"})
    justificationPdf: string;

    @IsString({ message: 'el id del periodo debe ser una cadena de texto debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo id del periodo"})
    idPeriod: string;

}
