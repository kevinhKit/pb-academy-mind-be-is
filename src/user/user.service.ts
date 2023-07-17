import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createECDH } from 'crypto';
import { response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { transporter } from 'src/utils/mailer';
import { SendEmailService } from 'src/shared/send-email/send-email.service';
import { EncryptPasswordService } from 'src/shared/encrypt-password/encrypt-password.service';
import { GenerteEmployeeNumberService } from 'src/shared/generte-employee-number/generte-employee-number.service';
import { GenerateEmailService } from 'src/shared/generate-email/generate-email.service';

@Injectable()
export class UserService {

  private readonly logger = new Logger('userLogger');

  constructor(

    private readonly sendEmailService: SendEmailService,
    private readonly encryptService: EncryptPasswordService,
    private readonly generteEmployeeNumberService: GenerteEmployeeNumberService,
    private readonly generateEmailService: GenerateEmailService,
    @InjectRepository(User) private userRepository: Repository<User>,


  ) {}

  async create({dni, email, ...others}: CreateUserDto) {

    try {

      const userExists = await this.userRepository.findOne({
        where:{
          dni: dni.replace('-','').replace('-',''),
          // email
        }
      });

      const count = await this.userRepository.count() || 0;

      if(!userExists){
        const generatePassword = await this.encryptService.generatePassword()
        const encripPassword = await this.encryptService.encodePassword(generatePassword)
        const user = {}
        Object.assign( user, await this.userRepository.create({
          dni:dni.replace('-','').replace('-',''),
          email: email.toLowerCase(),
          isAdmin: true,
          ...others,
          password: encripPassword,
          employeeNumber: await this.generteEmployeeNumberService.generate(Number(count+1))
        }))
       
        await this.userRepository.save(user);

        console.log( await this.generateEmailService.generate(
          JSON.parse(JSON.stringify(user)).firstName,
          JSON.parse(JSON.stringify(user)).secondName,
          JSON.parse(JSON.stringify(user)).firstLastName,
          JSON.parse(JSON.stringify(user)).secondLastName,
          this.userRepository,
          '@unah.hn'  
        ))

        await this.sendEmailService.sendCreationRegister(userExists,generatePassword,'hola')


        return {
          statusCode: 200,
          user,
          message: this.printMessageLog("Usuario Creado Exitosamente")
        }
      }

      const generatePassword = await this.encryptService.generatePassword()
      const encripPassword = await this.encryptService.encodePassword(generatePassword)

      userExists.isAdmin = true;
      userExists.password = encripPassword;
      if(userExists.employeeNumber === null){
        userExists.employeeNumber = await this.generteEmployeeNumberService.generate(Number(count+1));
      }
      await this.sendEmailService.sendCreationRegister(userExists,generatePassword,'d')
      console.log( await this.generateEmailService.generate(
        userExists.firstName,
        userExists.secondName,
        userExists.firstLastName,
        userExists.secondLastName,
        this.userRepository,
        '@unah.hn'  
      ))

      await this.userRepository.save(userExists);

      return {
        statusCode: 200,
        user: userExists,
        message: this.printMessageLog("Usuario Actualizado Exitosamente")
      }



    } catch (error) {
      console.log(error)
      console.log(error.response)
      return this.printMessageLog(error.response)
    }

    console.log(this.generteEmployeeNumberService.generate(1))




    // // const newMails = [];

    // try {
    //   const user = await this.userRepository.findOne({
    //     where: {
    //       dni: createUserDto.dni,
    //     },
    //   });

    //   if (user) {
    //     throw new ConflictException('Él usuario ya existe.');
    //   }
    //   const { newPasswordHash, newPassword } = await this.createPassword();
    //   const newUser = await this.userRepository.create({
    //     ...createUserDto,
    //     password: newPasswordHash,
    //     isAdmin: true,
    //   });

    //   const success = await this.userRepository.save(newUser);

    //   console.log(success);

    //   if (success) {
    //     const info = await transporter.sendMail({
    //       from: '"¡Inicia sesión!" <eralejo2003@gmail.com>', // sender address
    //       to: newUser.email as string, // list of receivers
    //       subject: '¡Bienvenido a registro UNAH!', // Subject line
    //       text: `Nombre: ${newUser.firstName} ${newUser.secondName} ${newUser.firstLastName} ${newUser.secondLastName}
    //       \Correo de Acceso: ${newUser.email}\nContraseña ${newPassword}\n`, // plain text body
    //     });
    //   }

    //   this.logger.log('Se ha creado al usuario correctamente');

    //   return {
    //     message: 'Se ha creado al usuario correctamente',
    //     statusCode: 200,
    //     newUser,
    //   };
    // } catch (error) {
    //   this.logger.error(error);
    //   return error.response;
    // }
    return `se ha creado el usuarios ${dni}`
  }

  async login({ email, password }: LoginUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: await email.toLowerCase(),
        },
      });

      if (!user) {
        throw new BadRequestException('El usuario no existe.');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Contraseña invalida.');
      }
      //

      return { authenticated: true, user: { user: user } };
    } catch (error) {
      this.logger.error(error);
      return error.response;
    }
  }

  findAll() {
    return `Esta opción retorna todos los usuarios`;
  }

  findOne(id: number) {
    return `Está acción retorna al usuario con el id #${id}.`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // if (updateUserDto.password) {
    //   let authenticated;
    //   const user = await this.userRepository.findOne({
    //     where: { dni: id },
    //   });
    //   if (user) {
    //     authenticated = await bcrypt.compare(
    //       updateUserDto.password,
    //       user.password,
    //     );
    //     if (authenticated) {
    //       const salt = await bcrypt.genSalt(10);
    //       const newPassword = await bcrypt.hash(
    //         updateUserDto.newPassword,
    //         salt,
    //       );
    //       const success = await this.userRepository.update(
    //         { dni: id },
    //         { password: newPassword },
    //       );
    //       if (success) {
    //         throw new HttpException('Perfil actualizado.', HttpStatus.OK);
    //       }
    //     } else {
    //       throw new HttpException(
    //         'Contraseña Incorrecta.',
    //         HttpStatus.UNAUTHORIZED,
    //       );
    //     }
    //   } else {
    //     throw new HttpException(
    //       'No se pudo actualizar el perfil.',
    //       HttpStatus.NOT_FOUND,
    //     );
    //   }
    // }

    // if (updateUserDto.description) {
    // }
    // return `Está acción actualiza al usuario con el id #${id}.`;
  }

  remove(id: number) {
    return `Está acción elimina al usuario con el id #${id}.`;
  }

  async createPassword() {
    const newPassword = Math.random().toString(36).substring(7);
    const newPasswordHash = await bcrypt.hashSync(newPassword, 10);
    return { newPasswordHash, newPassword };
  }

  printMessageLog(message){
    this.logger.log(message);
    return message;
  }

  async verifyEmail(email){

    const user = await this.userRepository.findOne({
      where:{
        email
      }
    });

    return user;

  }
}
