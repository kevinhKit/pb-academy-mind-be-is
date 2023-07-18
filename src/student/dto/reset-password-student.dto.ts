import { PartialType, PickType } from '@nestjs/mapped-types';
import { ResetPasswordUserDto } from 'src/user/dto/reset-password-user.dto';

export class ResetPasswordStudentDto extends PartialType(PickType(ResetPasswordUserDto,['password','newPassword'])) {

}
