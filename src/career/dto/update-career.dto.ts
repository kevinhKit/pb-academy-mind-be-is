import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerDto } from './create-career.dto';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCareerDto extends PartialType(CreateCareerDto) {
  @IsString({
    each: true,
    message: 'Los centros regionales deben de ser un arreglo de strings',
  })
  @IsNotEmpty({ message: 'El id del centro regional es un campo obligatorio.' })
  centerId: RegionalCenter[];
}
