import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Class } from 'src/class/entities/class.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Period } from 'src/period/entities/period.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';

export class CreateSectionDto {
  @IsNumber({}, { message: 'El id del periodo debe ser de tipo numerico.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el id del periodo' })
  idPeriod: Period;

  @IsNumber({}, { message: 'El id de la clase debe ser de tipo numerico.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el id de la clase' })
  idClass: Class;

  @IsString({ message: 'El id del docente debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el id del docente' })
  idTeacher: Teacher;

  @IsString({ message: 'El Numero de cupos debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el campo número de cupos' })
  space: string;

  @IsString({ message: 'Los dias de la clase deben ser de tipo texto' })
  @IsNotEmpty({ message: 'Los dias de la seccion no pueden ir vacios' })
  days: string;

  @IsString({ message: 'El Aula debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el campo aula' })
  idClassroom: Classroom;

  @IsString({ message: 'La hora debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el campo hora' })
  hour: string;

  @IsString({ message: 'La hora debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'No envió o dejo vacio el campo hora' })
  finalHour: string;
}
