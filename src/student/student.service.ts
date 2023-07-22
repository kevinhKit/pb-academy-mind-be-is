import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Student } from './entities/student.entity';
import * as bcrypt from 'bcrypt';
import { transporter } from 'src/utils/mailer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateStudentPasswordDto } from './dto/update-student-password.dto';
import { SendEmailService } from 'src/shared/send-email/send-email.service';
import { EncryptPasswordService } from 'src/shared/encrypt-password/encrypt-password.service';
import { GenerateEmployeeNumberService } from 'src/shared/generte-employee-number/generate-employee-number.service';
import { GenerateEmailService } from 'src/shared/generate-email/generate-email.service';
import { AccountNumberService } from 'src/shared/account-number/account-number.service';
import { max } from 'class-validator';
import { LoginStudentDto } from './dto/login-student.dto';

@Injectable()
export class StudentService {

  private readonly logger = new Logger('studentLogger');

  constructor(
    private readonly sendEmailService: SendEmailService,
    private readonly encryptService: EncryptPasswordService,
    private readonly generateEmployeeNumberService: GenerateEmployeeNumberService,
    private readonly accountNumberService: AccountNumberService,
    private readonly generateEmailService: GenerateEmailService,

    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async create({dni, email,...others}: CreateStudentDto) {
    try {

      const userExists = await this.userRepository.findOne({
        where:{dni: dni.replaceAll('-','')},
        relations:['teacher','student'],
      });

      let userStudent = new User();
      if(!userExists){
        userStudent = await this.userRepository.create(
          {dni:dni.replaceAll('-',''),
          ...others}
        );
      } else {
        userStudent = userExists;
      }

      if(Boolean(userStudent.student)){
        throw new ConflictException('El usuario ya existe como Estudiante.')
      }

      const EmailStudent = await this.studentRepository.findOne({
        where:{
          email:email.toLowerCase(),
          user:{
            dni:Not(dni.replaceAll('-',''))
          }
        }
      });

      if(EmailStudent){
        throw new ConflictException('El Correo electrónico ya está siendo usado por otro Estudiante.')
      }

      const number = await this.studentRepository.find({
        order:{
          create_at: 'DESC'
        }
      })

      let lastNumber = '0';
      if(number.length > 0){
        lastNumber  = number[0].accountNumber.slice(-5);
      }

      const generatePassword = await this.encryptService.generatePassword()
      const encripPassword = await this.encryptService.encodePassword(generatePassword)
      const accountNumber = await this.accountNumberService.generate(lastNumber);

      const newStudent = await this.studentRepository.create({
        institutionalEmail : await this.generateEmailService.generate(
          others.firstName,
          others.secondName,
          others.firstLastName,
          others.secondLastName,
          this.studentRepository,
          '@unah.hn'  
        ),
        email: email.toLowerCase(),
        password: encripPassword,
        accountNumber: accountNumber,
        incomeNote:Number(others.incomeNote)
      });

      if(!newStudent){
        throw new BadRequestException('No se ha podido crear el usuario de Estudiante');
      }

      await this.userRepository.save(userStudent);

      newStudent.user = userStudent;

      await this.studentRepository.save(newStudent);

      const returnUser = {...JSON.parse(JSON.stringify(newStudent.user))};
      returnUser.student = {...JSON.parse(JSON.stringify(newStudent))};
      delete returnUser.teacher;
      delete returnUser.student.user;
      
      await this.sendEmailService.sendCreationRegister(returnUser,generatePassword,'student')

      return {
        statusCode: 200,
        message: this.printMessageLog('El Estudiante se ha creado exitosamente'),
        user: returnUser
      }

    } catch (error){
      return this.printMessageError(error);
    }
   
  }


  async login({accountNumber, email, password}: LoginStudentDto) {
    try {
      const user = await this.studentRepository.findOne({
        where: {
          accountNumber
        },
        relations:['user']
      });

      if (!user) {
        throw new BadRequestException('El Usuario no existe.');
      }

      const ispassword = await this.encryptService.decodePassword(password, user.password)
      if(!ispassword){
        throw new UnauthorizedException('Contraseña invalida.');
      }

      let returnUser = {...JSON.parse(JSON.stringify(user.user))};
      returnUser.student = JSON.parse(JSON.stringify(user));
      delete returnUser.student.user;
      delete returnUser.student.password;
      delete returnUser.password;
      
      return {
        authenticated: true,
        user:returnUser,
        statusCode: 200
      };
    } catch (error) {
      return this.printMessageError(error)
    }
  }


  async createMultiple(createStudentDto: CreateStudentDto[]) {
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

  async update(id: string, {email, photoOne, photoTwo, photoThree,description, ...others}: UpdateStudentDto) {
    try {
      const student = await this.studentRepository.findOne({
        where: {
          user: {
            dni: id.replaceAll('-','')
          },
        },
        relations: ['user'],
      });

      if(!student){
       throw new NotFoundException('El Estudiante no se ha encontrado.');
      }


      const user = await this.userRepository.preload({
        dni: id.replaceAll('-',''),
        ...others,
      });

      const updateChangeStudent = await this.studentRepository.preload({
        accountNumber:student.accountNumber,
        photoOne,
        photoTwo,
        photoThree,
        description,
        email: email.toLowerCase(),
      });

      await this.userRepository.save(user);

      await this.studentRepository.save(updateChangeStudent);

      return {
        message: 'Se ha actualizado correctamente el estudiante',
        statusCode: 200,
        user,
      };
    } catch (error) {
      return this.printMessageError(error)
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

  printMessageLog(message){
    this.logger.log(message);
    return message;
  }

  printMessageError(message){
    if(message.response){

      if(message.response.message){
        this.logger.error(message.response.message);
        return message.response;
      }

      this.logger.error(message.response);
      return message.response;
    }

    this.logger.error(message);
    return message;
  }
}
