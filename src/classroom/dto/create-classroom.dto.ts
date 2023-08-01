import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CreateClassroomDto {



    @IsNumberString({},{ message: 'El código del aula debe ser de tipo número.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo código de aula"})
    codeClass: string;

    @IsString({ message: 'El edificio debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo edificio"})
    building: string;

}
