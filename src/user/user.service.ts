import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
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
          email
        }
      });
      const emailExists = await this.userRepository.findOne({
        where:{
          email
        }
      })

      if(emailExists){
        throw new ConflictException('El correo electrónico ya esta siendo usado por otro Usuario');
      }

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

        // console.log( await this.generateEmailService.generate(
        //   JSON.parse(JSON.stringify(user)).firstName,
        //   JSON.parse(JSON.stringify(user)).secondName,
        //   JSON.parse(JSON.stringify(user)).firstLastName,
        //   JSON.parse(JSON.stringify(user)).secondLastName,
        //   this.userRepository,
        //   '@unah.hn'  
        // ))

        await this.sendEmailService.sendCreationRegister(user,generatePassword,'hola')


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
      // console.log( await this.generateEmailService.generate(
      //   userExists.firstName,
      //   userExists.secondName,
      //   userExists.firstLastName,
      //   userExists.secondLastName,
      //   this.userRepository,
      //   '@unah.hn'  
      // ))

      await this.userRepository.save(userExists);

      return {
        statusCode: 200,
        user: userExists,
        message: this.printMessageLog("Usuario Actualizado Exitosamente")
      }
    } catch (error) {
      return this.printMessageError(error.response)
    }
    // console.log(this.generteEmployeeNumberService.generate(1))
  }

  async login({ employeeNumber, email, password }: LoginUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          // email: await email.toLowerCase(),
          employeeNumber
        },
      });

      if (!user) {
        throw new BadRequestException('El usuario no existe.');
      }

      // if (!bcrypt.compareSync(password, user.password)) {throw new UnauthorizedException('Contraseña invalida.');}
      const ispassword = await this.encryptService.decodePassword(password, user.password)
      if(!ispassword){
        throw new UnauthorizedException('Contraseña invalida.');
      }
      

      return {
        authenticated: true,
        user,
        statusCode: 200
      };
    } catch (error) {
      return this.printMessageError(error.response)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try{
      const user = await this.userRepository.preload({
        dni:id,
        ...updateUserDto
      })

      if(!user){
        throw new NotFoundException('El Administrador no se ha encontrado.');
      }

      await this.userRepository.save(user)

      return {
        statusCode: 200,
        user,
        message: this.printMessageLog("El Usuario se ha Actualizado Exitosamente")
      }
    }
    catch (error){
      return this.printMessageError(error.response)
    }
  }


  
  findAll() {
    return `Esta opción retorna todos los usuarios`;
  }


  findOne(id: number) {
    return `Está acción retorna al usuario con el id #${id}.`;
  }

  
  remove(id: number) {
    return `Está acción elimina al usuario con el id #${id}.`;
  }




  printMessageLog(message){
    this.logger.log(message);
    return message;
  }

  printMessageError(message){
    this.logger.error(message.message);
    return message;
  }

}
