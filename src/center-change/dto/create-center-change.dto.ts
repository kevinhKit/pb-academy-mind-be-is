import { IsNotEmpty, IsString } from "class-validator";

export class CreateCenterChangeDto {


    @IsString({ message: 'El número de cuenta debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo número de cuenta"})
    accountNumber: string;

    @IsString({ message: 'El id del centro regional debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo id del centro regional"})
    idCenter: string;

    @IsString({ message: 'La justificación debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo justificación"})
    justification: string;

    @IsString({ message: 'el pdf de justificación debe ser una cadena de texto debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo justificación de pdf"})
    justificationPdf: string;
}
