import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto';
// admin: 'isCoordinator','isBoss','isAdmin'
export class UpdateTeacherDto extends PartialType(
  PickType(CreateTeacherDto, ['email', 'address', 'phone', 'video']),
) {}
