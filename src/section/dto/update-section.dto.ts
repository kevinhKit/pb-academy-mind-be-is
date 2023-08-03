import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionDto } from './create-section.dto';
import { IsOptional, IsString } from 'class-validator';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';

export class UpdateSectionDto extends PartialType(CreateSectionDto) {
  @IsString({ message: 'El id del docente debe ser de tipo texto.' })
  @IsOptional()
  idTeacher: Teacher;

  @IsString({ message: 'El Numero de cupos debe ser de tipo texto.' })
  @IsOptional()
  space: string;

  @IsString({ message: 'Los dias de la clase deben ser de tipo texto' })
  @IsOptional()
  days: string;

  @IsString({ message: 'La hora debe ser de tipo texto.' })
  @IsOptional()
  hour: string;

  @IsString({ message: 'La hora debe ser de tipo texto.' })
  @IsOptional()
  finalHour: string;

  @IsString({ message: 'El Aula debe ser de tipo texto.' })
  @IsOptional()
  idClassroom: Classroom;
}
