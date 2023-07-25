import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Not, Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { User } from 'src/user/entities/user.entity';
import { SendEmailService } from 'src/shared/send-email/send-email.service';
import { EncryptPasswordService } from 'src/shared/encrypt-password/encrypt-password.service';
import { GenerateEmployeeNumberService } from 'src/shared/generte-employee-number/generate-employee-number.service';
import { GenerateEmailService } from 'src/shared/generate-email/generate-email.service';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { ResetPasswordTeacherDto } from './dto/reset-password-teacher.dto';
import { ChangePasswordTeacherDto } from './dto/change-password-teacher.dto';

@Injectable()
export class TeacherService {
  private readonly logger = new Logger('teacherLogger');

  constructor(

    private readonly sendEmailService: SendEmailService,
    private readonly encryptService: EncryptPasswordService,
    private readonly generateEmployeeNumberService: GenerateEmployeeNumberService,
    private readonly generateEmailService: GenerateEmailService,

    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) {}

  async create({dni, email, photoOne, isBoss, isCoordinator,video,...others}: CreateTeacherDto) {

    try{

      const userExists = await this.userRepository.findOne({
        where:{dni: dni.replaceAll('-','')},
        relations:['teacher','student'],
      });

      const allTeacher = await this.teacherRepository.find({ relations: ['user'] });
      const usersWithEmployeeNumber = await this.userRepository
        .createQueryBuilder('user').select('user.dni')
        .where('user.employeeNumber IS NOT NULL').getMany();

      const allTeacherDNIs = allTeacher.map((teacher) => teacher.user.dni);
      const allUsersDni = usersWithEmployeeNumber.map(user => user.dni);

      const arrayDniEmployeeNumber = [...new Set(allUsersDni.concat(allTeacherDNIs))];
      const count = arrayDniEmployeeNumber.length || 0;

      let userTeacher = new User();
      if(!userExists){
        userTeacher = await this.userRepository.create(
          {dni:dni.replaceAll('-',''),
          ...others,}
        );
      } else {
        userTeacher = userExists;
      }

      if(Boolean(userTeacher.teacher)){
        throw new ConflictException('El usuario ya existe como docente.')
      }

      const Emailteacher = await this.teacherRepository.findOne({
        where:{
          email:email.toLowerCase(),
          user:{
            dni:Not(dni.replaceAll('-',''))
          }
        }
      });

      if(Emailteacher){
        throw new ConflictException('El Correo electrónico ya está siendo usado por otro Docente.')
      }

      const generatePassword = await this.encryptService.generatePassword()
      const encripPassword = await this.encryptService.encodePassword(generatePassword)

      const newTeacher = await this.teacherRepository.create({
        employeeNumber: (userTeacher.employeeNumber)? userTeacher.employeeNumber : await this.generateEmployeeNumberService.generate(Number(count)),
        institutionalEmail : await this.generateEmailService.generate(
          others.firstName,
          others.secondName,
          others.firstLastName,
          others.secondLastName,
          this.teacherRepository,
          '@unah.edu.hn'  
        ),
        photoOne,
        email: email.toLowerCase(),
        password: encripPassword,
        isBoss: isBoss || false,
        isCoordinator: isCoordinator || false
      });

      if(!newTeacher){
        throw new BadRequestException('No se ha podido crear al docente');
      }

      await this.userRepository.save(userTeacher);

      newTeacher.user = userTeacher;

      await this.teacherRepository.save(newTeacher);

      const returnUser = {...JSON.parse(JSON.stringify(newTeacher.user))};
      returnUser.teacher = {...JSON.parse(JSON.stringify(newTeacher))};
      delete returnUser.teacher.user;
      await this.sendEmailService.sendCreationRegister(returnUser,generatePassword,'teacher')

      return {
        statusCode: 200,
        message: this.printMessageLog('El docente se ha creado exitosamente'),
        user: returnUser
      }

    } catch(error){
      return this.printMessageError(error);
    }
  }


  async login({ employeeNumber, email, password }: LoginTeacherDto) {
    try {
      const user = await this.teacherRepository.findOne({
        where: {
          employeeNumber
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
      returnUser.teacher = JSON.parse(JSON.stringify(user));
      delete returnUser.teacher.user;
      delete returnUser.teacher.password;
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



  findAll() {
    const allTeachers = this.teacherRepository.find({ relations: ['user'] });
    return allTeachers;
  }


  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }


  async update(id: string, {email, video, photoOne,description, ...updateTeacher}: UpdateTeacherDto) {

    try{
      const teacher = await this.teacherRepository.findOne({
        where: {
          user: {
            dni: id.replaceAll('-','')
          },
        },
        relations: ['user'],
      });

      if(!teacher){
       throw new NotFoundException('El Docente no se ha encontrado.');
      }

      email = (email) ? email.toLowerCase() : email;

      const updateChangeTeacher = await this.teacherRepository.preload({
        employeeNumber: teacher.employeeNumber,
        video,
        photoOne,
        description,
        email: email
      });

      const updateUser = await this.userRepository.preload({
        dni: id.replaceAll('-',''),
        ...updateTeacher
      });

      const saveTeacher = await this.teacherRepository.save(updateChangeTeacher)
      const saveUser = await this.userRepository.save(updateUser)
      
      const returnTeacher = JSON.parse(JSON.stringify(saveUser));
      returnTeacher.teacher = JSON.parse(JSON.stringify(saveTeacher));
      delete returnTeacher.teacher.user;

      return {
        statusCode: 200,
        user:returnTeacher,
        message: this.printMessageLog("El Usuario se ha Actualizado Exitosamente")
      }
    }
    catch (error){
      console.log(error)
     return this.printMessageError(error)
    }

  }


  remove(id: number) {
    return `This action removes a #${id} teacher`;
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

  async changePassword(id: string,{password, newPassword}: ChangePasswordTeacherDto){
    try{
      const user = await this.teacherRepository.findOne({
        where:{
          user:{
            dni:id.replaceAll('-','')
          }
        }
      })

      if(!user){
        throw new NotFoundException('El Docente no se ha encontrado.');
      }

      const ispassword = await this.encryptService.decodePassword(password, user.password)
      if(!ispassword){
        throw new UnauthorizedException('Contraseña invalida.');
      }
      
      const encripPassword = await this.encryptService.encodePassword(newPassword);
      
      const teacherChange = await this.teacherRepository.preload({
        employeeNumber:user.employeeNumber,
        password:encripPassword
      })

      await this.teacherRepository.save(teacherChange);

      return {
        statusCode: 200,
        // user,
        message: this.printMessageLog("La contraseña se ha cambiado exitosamente")
      }

    } catch (error){
      return this.printMessageError(error);
    }
  }

  async resetPassword( {dni}: ResetPasswordTeacherDto){
    try{
      const user = await this.teacherRepository.findOne({
        where:{
          user:{
            dni:dni.replaceAll('-','')
          }
        }
      })

      if(!user){
        throw new NotFoundException('El Usuario no se ha encontrado.');
      }

      const generatePassword = await this.encryptService.generatePassword();
      const encripPassword = await this.encryptService.encodePassword(generatePassword);
      
      const teacherChange = await this.teacherRepository.preload({
        employeeNumber:user.employeeNumber,
        password:encripPassword
      })

      await this.teacherRepository.save(teacherChange);
      await this.sendEmailService.sendNewPassword(teacherChange,generatePassword,'teacher');

      return {
        statusCode: 200,
        message: this.printMessageLog("La contraseña se ha cambiado exitosamente")
      }

    } catch (error){
      return this.printMessageError(error);
    }
  }


}
