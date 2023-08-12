import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum applicationStatusOption {
    ACCEPTED = 'Aceptada',
    REJECTED = 'Rechazada',
}

export class ReviewCareerChangeDto {

    @IsString({ message: 'El id del cambio de carrera debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo id del cambio de carrera"})
    idCareerChange: string;

    @IsEnum(applicationStatusOption, {message:"El estatus de la aplicación solo puede ser: Aceptada o Rechazada"})
    @IsNotEmpty({message: "No envió o dejo vacio el campo id estatus de la solicitud"})
    aplicationStatus: string;

}
