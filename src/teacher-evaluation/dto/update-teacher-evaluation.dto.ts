import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherEvaluationDto } from './create-teacher-evaluation.dto';

export class UpdateTeacherEvaluationDto extends PartialType(CreateTeacherEvaluationDto) {}
