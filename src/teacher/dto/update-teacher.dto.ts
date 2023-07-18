import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
// admin: 'isCoordinator','isBoss','isAdmin'
export class UpdateTeacherDto extends PartialType(
  PickType(UpdateUserDto, ['email', 'address', 'phone','description']),
) {


  @IsOptional()
  @IsString({message: "El video debe ser una cadena de texto."})
  @IsNotEmpty({message: "No envió o dejo vacio el campo video"})
  video: string;


  @IsOptional()
  @IsString({message: "La Fotografia uno, no cumple el formtao requerido."})
  @IsNotEmpty({message: "No envió o dejo vacio el campo primer fotografia"})
  photoOne: string;




}
