import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'Esta acción agrega un nuevo usuario.';
  }

  findAll() {
    return `Esta opción retorna todos los usuarios`;
  }

  findOne(id: number) {
    return `Está acción retorna al usuario con el id #${id}.`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `Está acción actualiza al usuario con el id #${id}.`;
  }

  remove(id: number) {
    return `Está acción elimina al usuario con el id #${id}.`;
  }
}
