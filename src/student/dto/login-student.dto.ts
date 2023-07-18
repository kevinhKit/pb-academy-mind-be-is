import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { LoginUserDto } from "src/user/dto/login-user.dto";

export class LoginStudentDto extends PartialType(PickType(LoginUserDto, ['password'])) {

    @IsNumberString({},{ message: 'El Número de Cuenta debe ser de tipo número.' })
    @IsNotEmpty({message: 'No envió o dejo vacio el campo Número de Cuenta'})
    accountNumber: string;

}
