import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';
import * as bcrypt from 'bcrypt';
import { transporter } from 'src/utils/mailer';
import { Teacher } from 'src/teacher/entities/teacher.entity';

import { CreateAuthDto } from './dto/create-auth.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { accountNumber, password, employeeNumber } = createAuthDto;
    let authenticated;
    let user;
    if (accountNumber) {
      const student = await this.studentRepository.findOne({
        where: { accountNumber: accountNumber },
        relations: ['user'],
      });
      if (student) {
        authenticated = await bcrypt.compare(password, student.user.password);
        console.log(authenticated);
        if (authenticated) {
          user = student;
        }
      }
    }
    if (employeeNumber) {
      const teacher = await this.teacherRepository.findOne({
        where: { employeeNumber: employeeNumber },
        relations: ['user'],
      });
      if (teacher) {
        authenticated = await bcrypt.compare(password, teacher.user.password);
        console.log(authenticated);
        if (authenticated) {
          user = teacher;
        }
      }
    }
    if (!authenticated) {
      throw new HttpException(
        'Credenciales incorrectas.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { authenticated, user };
  }
}
