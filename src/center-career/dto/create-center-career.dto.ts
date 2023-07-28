import { IsNotEmpty, IsString } from "class-validator";

export class CreateCenterCareerDto {


    @IsString({ message: 'El id de la Carrera debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el id de la Carrera"})
    idCareer: string;


    @IsString({ message: 'El id del Centro Regional debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el id del Centro Regional"})
    idCenter: string;


}
