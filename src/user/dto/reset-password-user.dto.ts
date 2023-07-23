import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, Matches, IsNotEmpty } from 'class-validator';

export class ResetPasswordUserDto extends PartialType(PickType(CreateUserDto, ['dni'])) {
  
}
