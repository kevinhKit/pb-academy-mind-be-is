import { PartialType, PickType } from '@nestjs/mapped-types';
import { ChangePasswordUserDto } from 'src/user/dto/change-password-user.dto.';


export class ChangePasswordTeacherDto extends PartialType(PickType(ChangePasswordUserDto,['password','newPassword'])) {

}
