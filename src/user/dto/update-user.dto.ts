import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(PickType(CreateUserDto, ['email', 'address', 'phone', 'description'])) {

  

}
