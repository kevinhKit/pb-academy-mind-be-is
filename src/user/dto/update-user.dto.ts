import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(PickType(CreateUserDto, ['email', 'address', 'phone', 'description','photoOne'])) {


}
