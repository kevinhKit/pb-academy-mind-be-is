import { PartialType, PickType } from '@nestjs/mapped-types';
import { ResetPasswordUserDto } from 'src/user/dto/reset-password-user.dto';

export class ResetPasswordTeacherDto extends PartialType(PickType(ResetPasswordUserDto,['dni'])) {

}
