import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: 'La contraseña debe de ser de tipo texto.' })
  password?: string;
  @IsOptional()
  @IsString({ message: 'La nueva contraseña debe de ser de tipo texto.' })
  newPassword?: string;
  @IsOptional()
  @IsString({ message: 'La descripción debe de ser de tipo texto.' })
  description?: string;
}
