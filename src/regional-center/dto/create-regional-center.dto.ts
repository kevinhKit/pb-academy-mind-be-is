import { IsNotEmpty, IsString } from "class-validator";

export class CreateRegionalCenterDto {

    @IsString({ message: 'El id del centro regional debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el id del Centro Regional"})
    id: string;


    @IsString({ message: 'El nombre del centro regional debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el nombre del Centro Regional"})
    name: string;


    @IsString({ message: 'La descripción del centro regional debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacia  la descripción del Centro Regional"})
    description: string;

}
