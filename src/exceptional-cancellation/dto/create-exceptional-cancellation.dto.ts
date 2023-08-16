import { IsNotEmpty, IsString } from 'class-validator';
import { Tuition } from 'src/tuition/entities/tuition.entity';
export class CreateExceptionalCancellationDto {
  @IsNotEmpty()
  @IsString({ message: 'La razon de la cancelacion debe ser de tipo texto.' })
  reason: string;

  @IsNotEmpty()
  @IsString({
    message: 'El pdf con el motivo de la cancelacion debe ser de tipo texto.',
  })
  justificationPdf: string;

  @IsNotEmpty()
  @IsString({
    message: 'La matricula a cancelar debe ser de tipo texto.',
  })
  idTuition: Tuition;
}
