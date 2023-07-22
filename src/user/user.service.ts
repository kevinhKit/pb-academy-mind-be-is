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
import { LoginUserDto } from './dto/login-user.dto';
// import { transporter } from 'src/utils/mailer';
import { SendEmailService } from 'src/shared/send-email/send-email.service';
import { EncryptPasswordService } from 'src/shared/encrypt-password/encrypt-password.service';
import { GenerateEmployeeNumberService } from 'src/shared/generte-employee-number/generate-employee-number.service';
import { GenerateEmailService } from 'src/shared/generate-email/generate-email.service';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@Injectable()
export class UserService {

  private readonly logger = new Logger('userLogger');

  constructor(

    private readonly sendEmailService: SendEmailService,
    private readonly encryptService: EncryptPasswordService,
    private readonly generateEmployeeNumberService: GenerateEmployeeNumberService,
    private readonly generateEmailService: GenerateEmailService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,


  ) {}

  async create({dni, email, ...others}: CreateUserDto) {
    try {
      const userExists = await this.userRepository.findOne({
        where:{dni: dni.replace('-','').replace('-','')},
        relations:['teacher','student'],
      });

      const allTeacher = await this.teacherRepository.find({ relations: ['user'] });
      const usersWithEmployeeNumber = await this.userRepository
        .createQueryBuilder('user').select('user.dni')
        .where('user.employeeNumber IS NOT NULL').getMany();

      const allTeacherDNIs = allTeacher.map((teacher) => teacher.user.dni);
      const allUsersDni = usersWithEmployeeNumber.map(user => user.dni);

      const arrayDniEmployeeNumber = [...new Set(allUsersDni.concat(allTeacherDNIs))]
      const count = arrayDniEmployeeNumber.length || 0;

      console.log(userExists)
      console.log('@@@@@@@@@@@@@@@@@')
      console.log(`${Boolean(userExists.teacher)} : docente`)
      console.log(`${Boolean(userExists.student)} : estudiante`)
      console.log(`${Boolean(null)} : nullo`)
      console.log(`${Boolean(undefined)} : undefined`)

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
          employeeNumber: await this.generateEmployeeNumberService.generate(Number(count))
        }))
       
        await this.userRepository.save(user);
        await this.sendEmailService.sendCreationRegister(user,generatePassword,'admin')

        return {
          statusCode: 200,
          user,
          message: this.printMessageLog("Usuario Creado Exitosamente")
        }
      }


      // if( Boolean(userExists) && Boolean(userExists.employeeNumber) === true && userExists.isAdmin == true){
      if( Boolean(userExists)  && userExists.isAdmin == true){
        throw new BadRequestException('El usuario ya es un Administrador');
      }

      const emailExists = await this.userRepository.findOne({
        where:{
          email
        }
      })

      if(emailExists){
        throw new ConflictException('El Correo Electrónico ya esta siendo usado por otro Usuario');
      }

      const teacherExist = this.teacherRepository.findOne({
        where:{
          user:{
            dni: dni.replace('-','').replace('-',''),
          }
        }
      });
      
      // console.log(count)
      // #########################
      // console.log(count)



      const generatePassword = await this.encryptService.generatePassword()
      const encripPassword = await this.encryptService.encodePassword(generatePassword)

      userExists.isAdmin = true;
      userExists.email = email;
      userExists.password = encripPassword;
      if(userExists.employeeNumber === null){
        userExists.employeeNumber = (teacherExist) ? (await teacherExist).employeeNumber: await this.generateEmployeeNumberService.generate(Number(count));
      }
      await this.sendEmailService.sendCreationRegister(userExists,generatePassword,'admin')
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
      // console.log(error)
      return this.printMessageError(error)
    }
    // console.log(this.generateEmployeeNumberService.generate(1))
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
      return this.printMessageError(error)
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
      return this.printMessageError(error)
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
