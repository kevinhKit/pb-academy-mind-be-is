import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  create(createStudentDto: CreateStudentDto) {
    return 'Está acción crea un nuevo Estudiante';
  }

  findAll() {
    return `Está acción devuelve todos los Estudiantes`;
  }

  findOne(id: number) {
    return `Está acción devuelve al estudiante con el id  #${id}`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `Está acción devuele al estudiante con el id #${id}`;
  }

  remove(id: number) {
    return `Está acción elimina al estudiante con el id #${id}`;
  }
}
