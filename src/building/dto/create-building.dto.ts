import { IsNotEmpty, IsString } from "class-validator";

export class CreateBuildingDto {


    @IsString({ message: 'El nombre debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo nombre"})
    name: string;

    @IsString({ message: 'La ubicación debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo ubicación"})
    location: string;

    @IsString({ message: 'EL centro regional debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo centro regional"})
    regionalCenter: string;


}
