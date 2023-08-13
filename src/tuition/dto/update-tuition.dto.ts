import { PartialType } from '@nestjs/mapped-types';
import { CreateTuitionDto } from './create-tuition.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { classStatus } from '../entities/tuition.entity';

export class UpdateTuitionDto extends PartialType(CreateTuitionDto) {
  @IsString({ message: 'La nota debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el campo de nota' })
  note: string;

  @IsOptional()
  @IsEnum(classStatus, { message: 'El estado de la clase debe ser tipo texto' })
  statusClass: classStatus;
}
