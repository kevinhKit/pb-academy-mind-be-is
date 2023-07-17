import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { LoginUserDto } from "src/user/dto/login-user.dto";

export class LoginTeacherDto extends PartialType(PickType(LoginUserDto, ['password'])) {

    @IsNumberString({},{ message: 'El Número de Empleado debe ser de tipo número.' })
    @IsNotEmpty({message: 'No envió o dejo vacio el campo Número de Empleado'})
    employeeNumber: string;

}
