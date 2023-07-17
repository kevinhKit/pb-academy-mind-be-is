import { PartialType, PickType } from '@nestjs/mapped-types';
import {
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateTeacherDto extends PartialType(PickType(CreateUserDto, ['dni','firstName','secondName','firstLastName', 'secondLastName', 'email', 'address', 'phone', 'description'])) {

  @IsBoolean()
  isTeacher: boolean;

  @IsBoolean()
  isBoss: boolean;

  @IsBoolean()
  isCoordinator: boolean;
  
  @IsOptional()
  @IsString()
  video: string;
}
