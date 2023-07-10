import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString({ message: 'La contraseña debe de ser de tipo texto.' })
  password?: string;
  @IsString({ message: 'La nueva contraseña debe de ser de tipo texto.' })
  newPassword?: string;
  @IsString({ message: 'La descripción debe de ser de tipo texto.' })
  description?: string;
}
