import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentCareerDto } from './create-student-career.dto';

export class UpdateStudentCareerDto extends PartialType(CreateStudentCareerDto) {}
