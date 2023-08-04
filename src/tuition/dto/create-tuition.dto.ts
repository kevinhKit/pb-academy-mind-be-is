import { IsNotEmpty, IsString } from 'class-validator';
import { Section } from 'src/section/entities/section.entity';
import { Student } from 'src/student/entities/student.entity';

export class CreateTuitionDto {
  @IsString({ message: 'La seccion debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el campo de seccion' })
  idSection: Section;

  @IsString({ message: 'El id del estudiante debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el id del estudiante' })
  idStudent: Student;
}
