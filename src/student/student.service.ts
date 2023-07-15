import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Student } from './entities/student.entity';
import * as bcrypt from 'bcrypt';
import { transporter } from 'src/utils/mailer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateStudentPasswordDto } from './dto/update-student-password.dto';

@Injectable()
export class StudentService {

  private readonly logger = new Logger('teacherLogger');


  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto[]) {
    // const newUsers = [];
    // const newStudents = [];
    // const newMails = [];
    // for (const [index, createStudent] of createStudentDto.entries()) {
    //   const {
    //     dni,
    //     firstLastName,
    //     firstName,
    //     secondLastName,
    //     secondName,
    //     email,
    //     address,
    //     career,
    //   } = createStudent;

    //   const newPassword = Math.random().toString(36).substring(7);
    //   const salt = await bcrypt.genSalt(10);
    //   const password = await bcrypt.hash(newPassword, salt);

    //   const user = this.userRepository.create({
    //     dni: dni,
    //     firstName: firstName,
    //     secondName: secondName,
    //     firstLastName: firstLastName,
    //     secondLastName: secondLastName,
    //     email: email,
    //     password: password,
    //     address: address,
    //   });

    //   const count = await this.studentRepository.count();
    //   let newAccountNumber = '';
    //   if (count <= 9) {
    //     newAccountNumber = `000${count + index}`;
    //   } else if (count <= 99) {
    //     newAccountNumber = `00${count + index}`;
    //   } else if (count <= 999) {
    //     newAccountNumber = `0${count + index}`;
    //   } else {
    //     newAccountNumber = `${count + index}`;
    //   }

    //   let newEmail = `${firstName.trim().toLowerCase()}.${firstLastName
    //     .trim()
    //     .toLowerCase()}@unah.hn`;
    //   let emailExists = await this.studentRepository.findOne({
    //     where: { institutionalEmail: newEmail },
    //   });
    //   while (emailExists) {
    //     const randomString = Math.floor(Math.random() * 99) + 1; // Generar una cadena aleatoria
    //     newEmail = `${firstName.trim().toLowerCase()}.${firstLastName
    //       .trim()
    //       .toLowerCase()}.${randomString}@unah.hn`;
    //     emailExists = await this.studentRepository.findOne({
    //       where: { institutionalEmail: newEmail },
    //     });
    //   }

    //   const newStudent = new Student();
    //   newStudent.accountNumber = newAccountNumber;
    //   newStudent.institutionalEmail = newEmail;
    //   newStudent.career = career;

    //   newStudent.user = user;
    //   newUsers.push(user);
    //   newStudents.push(newStudent);
    //   newMails.push({
    //     from: '"¡Inicia sesión!" <eralejo2003@gmail.com>', // sender address
    //     to: user.email as string, // list of receivers
    //     subject: '¡Bienvenido a registro UNAH!', // Subject line
    //     text: `Nombre: ${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}
    //         \Número de cuenta: ${newStudent.accountNumber}\nContraseña ${newPassword}\nCorreo institucional: ${newStudent.institutionalEmail}`, // plain text body
    //   });
    // }
    // const savedUsers = await this.userRepository.save(newUsers);
    // if (savedUsers) {
    //   const savedStudent = await this.studentRepository.save(newStudents);
    //   if (savedStudent) {
    //     newMails.forEach(async (mail) => {
    //       const info = await transporter.sendMail(mail);
    //     });
    //   }
    // }
    // return {
    //   student: newStudents,
    // };
  }

  findAll() {
    const allStudents = this.studentRepository.find({ relations: ['user'] });
    return allStudents;
  }

  findOne(id: number) {
    return `Está acción devuelve al estudiante con el id  #${id}`;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      const user = await this.userRepository.preload({
        dni: id,
        ...updateStudentDto,
      });

      if (!user) {
        throw new NotFoundException('El Estudiante no se ha encontrado.');
      }

      await this.userRepository.save(user);

      return {
        message: 'Se ha actualizado correctamente el estudiante',
        statusCode: 200,
        user,
      };
    } catch (error) {
      this.logger.error(error);
      return error.response;
    }
  }

  remove(id: number) {
    return `Está acción elimina al estudiante con el id #${id}`;
  }

  async resetPassword(updateStudentPasswordDto: UpdateStudentPasswordDto) {
    const student = await this.studentRepository.findOne({
      where: { accountNumber: updateStudentPasswordDto.accountNumber },
      relations: ['user'],
    });
    if (!student) {
      throw new HttpException(
        'No se pudo encontrar el estudiante.',
        HttpStatus.NOT_FOUND,
      );
    }
    const newPassword = Math.random().toString(36).substring(7);
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);
    student.user.password = password;
    const success = await this.userRepository.save(student.user);
    if (success) {
      await transporter.sendMail({
        from: '"¡Inicia sesión!" <eralejo2003@gmail.com>', // sender address
        to: student.user.email, // list of receivers
        subject: '¡Bienvenido a registro UNAH!', // Subject line
        text: `Nombre: ${student.user.firstName} ${student.user.secondName} ${student.user.firstLastName} ${student.user.secondLastName}
            \Número de cuenta: ${student.accountNumber}\nContraseña ${newPassword}\nCorreo institucional: ${student.institutionalEmail}`, // plain text body
      });
    }
    return new HttpException('Contraseña reiniciada.', HttpStatus.OK);
  }
}
