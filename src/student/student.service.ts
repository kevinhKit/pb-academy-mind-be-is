import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Student } from './entities/student.entity';
import * as bcrypt from 'bcrypt';
import { transporter } from 'src/utils/mailer';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const {
      dni,
      firstLastName,
      firstName,
      secondLastName,
      secondName,
      email,
      address,
      career,
    } = createStudentDto;
    const newPassword = Math.random().toString(36).substring(7);
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);

    const user = this.userRepository.create({
      dni: dni,
      firstName: firstName,
      secondName: secondName,
      firstLastName: firstLastName,
      secondLastName: secondLastName,
      email: email,
      password: password,
      address: address,
    });

    const count = await this.studentRepository.count();
    let newAccountNumber = '';
    if (count <= 9) {
      newAccountNumber = `000${count}`;
    } else if (count <= 99) {
      newAccountNumber = `00${count}`;
    } else if (count <= 999) {
      newAccountNumber = `0${count}`;
    } else {
      newAccountNumber = `${count}`;
    }

    let newEmail = `${firstName}.${firstLastName}@unah.hn`;
    let emailExists = await this.studentRepository.findOne({
      where: { institutionalEmail: newEmail },
    });
    while (emailExists) {
      const randomString = Math.floor(Math.random() * 99) + 1; // Generar una cadena aleatoria
      newEmail = `${firstName}.${firstLastName}.${randomString}@unah.hn`;
      emailExists = await this.studentRepository.findOne({
        where: { institutionalEmail: newEmail },
      });
    }

    const newStudent = new Student();
    newStudent.accountNumber = newAccountNumber;
    newStudent.institutionalEmail = newEmail;
    newStudent.career = career;

    newStudent.user = user;

    await this.userRepository.save(user);
    const savedStudent = await this.studentRepository.save(newStudent);

    if (savedStudent) {
      const info = await transporter.sendMail({
        from: '"¡Inicia sesión!" <eralejo2003@gmail.com>', // sender address
        to: user.email as string, // list of receivers
        subject: '¡Bienvenido a registro UNAH!', // Subject line
        text: `Nombre: ${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}
            \Número de cuenta: ${user.dni}\nContraseña ${newPassword}\nCorreo institucional: ${newStudent.institutionalEmail}`, // plain text body
      });
    }

    return {
      student: newStudent,
    };
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
