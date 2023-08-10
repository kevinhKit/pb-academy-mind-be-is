import { PartialType } from '@nestjs/mapped-types';
import { CreateTuitionDto } from './create-tuition.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTuitionDto extends PartialType(CreateTuitionDto) {
  @IsString({ message: 'La nota debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el campo de nota' })
  note: string;
}
