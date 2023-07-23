import { PartialType, PickType } from '@nestjs/mapped-types';
import { ChangePasswordUserDto } from 'src/user/dto/change-password-user.dto.';

export class ChangePasswordStudentDto extends PartialType(PickType(ChangePasswordUserDto,['password','newPassword'])) {

}
