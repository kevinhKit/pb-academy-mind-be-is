import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Period } from 'src/period/entities/period.entity';
import { Student } from 'src/student/entities/student.entity';

export class CreateRepositionRequestDto {
  @IsNumber({}, { message: 'El id del periodo debe ser de tipo numerico.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el id del periodo' })
  idPeriod: Period;

  @IsString({ message: 'El id del estudiante debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el id del estudiante' })
  idStudent: Student;

  @IsString({ message: 'Lajustificacióndebe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacia la justifiación ' })
  justification: string;
}
