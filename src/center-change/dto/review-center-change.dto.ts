import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum applicationStatusOption {
    ACCEPTED = 'Aceptada',
    REJECTED = 'Rechazada',
}

export class ReviewCenterChangeDto {

    @IsString({ message: 'El id del cambio de centro debe ser de tipo texto.' })
    @IsNotEmpty({message: "No envió o dejo vacio el campo id del cambio de centro"})
    idCenterChange: string;

    @IsEnum(applicationStatusOption, {message:"El estatus de la aplicación solo puede ser: Aceptada o Rechazada"})
    @IsNotEmpty({message: "No envió o dejo vacio el campo id estatus de la solicitud"})
    aplicationStatus: string;

}
