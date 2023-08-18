import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CriteriaAnalyticDto {

    @IsString({message: "El periodo academico debe ser de tipo texto"})
    @IsNotEmpty({message: "No envío o dejo vacio el campo id del periodo"})
    idPeriod: number;

    @IsString({message: "El id de la carrera debe ser de tipo texto"})
    @IsNotEmpty({message: "No envío o dejo vacio el campo id de la carrera"})
    idCareer: string;

    @IsString({message: "El id del centro regional debe ser de tipo texto"})
    @IsNotEmpty({message: "No envío o dejo vacio el campo id del centro regional"})
    idRegionalCenter: string;

    @IsNumberString({},{message: "El id de la clase debe ser de tipo número"})
    @IsNotEmpty({message: "No envío o dejo vacio el campo id de la clase"})
    @IsOptional()
    idClass: string;

    @IsString({message: "El campo estudiantes reprobados debe ser de tipo texto"})
    @IsNotEmpty({message: "No envío o dejo vacio el campo Estudiante reprobados"})
    @IsOptional()
    failedStudent: boolean;

    @IsString({message: "El campo estudiantes Aprobados debe ser de tipo texto"})
    @IsNotEmpty({message: "No envío o dejo vacio el campo estudiantes aprobados"})
    @IsOptional()
    approvedStudent: boolean;
    //numero de empleados, docentes

}
