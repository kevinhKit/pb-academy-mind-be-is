import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { TeachingCareer } from 'src/teaching-career/entities/teaching-career.entity';
import * as jwt from 'jsonwebtoken';
import { ChangeRolTeacherDto } from './dto/change-rol-teacher.dto';
import { CareerChange } from 'src/career-change/entities/career-change.entity';
import { CenterChange } from 'src/center-change/entities/center-change.entity';

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
    // @InjectRepository(CareerChange) private careerChangeRepository: Repository<CareerChange>,
    // @InjectRepository(CenterChange) private centerChangeRepository: Repository<CenterChange>,
    @InjectRepository(CenterCareer)
    private centerCareerRepository: Repository<CenterCareer>,
    @InjectRepository(TeachingCareer)
    private teacherCareerRepository: Repository<TeachingCareer>,
  ) {}

  async create({
    dni,
    email,
    photoOne,
    isBoss,
    isCoordinator,
    video,
    regionalCenter,
    career,
    ...others
  }: CreateTeacherDto) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { dni: dni.replaceAll('-', '') },
        relations: ['teacher', 'student'],
      });

      const allTeacher = await this.teacherRepository.find({
        relations: ['user'],
      });
      const usersWithEmployeeNumber = await this.userRepository
        .createQueryBuilder('user')
        .select('user.dni')
        .where('user.employeeNumber IS NOT NULL')
        .getMany();

      const allTeacherDNIs = allTeacher.map((teacher) => teacher.user.dni);
      const allUsersDni = usersWithEmployeeNumber.map((user) => user.dni);

      const arrayDniEmployeeNumber = [
        ...new Set(allUsersDni.concat(allTeacherDNIs)),
      ];
      const count = arrayDniEmployeeNumber.length || 0;

      let userTeacher = new User();
      if (!userExists) {
        userTeacher = await this.userRepository.create({
          dni: dni.replaceAll('-', ''),
          ...others,
        });
      } else {
        userTeacher = userExists;
      }

      if (Boolean(userTeacher.teacher)) {
        throw new ConflictException('El usuario ya existe como docente.');
      }

      if(Boolean(isBoss) == true){
        const teacherBossExits = await this.teacherRepository.findOne({
          where: {
            isBoss: isBoss,
            teachingCareer:{
              centerCareer:{
                career:{
                  id: career
                },
                regionalCenter:{
                  id:regionalCenter
                }
              }
            }
          },
        });

        if(teacherBossExits){
          throw new ConflictException('Ya existe un jefe de departamento para está carrera')
        }
      }

      if(Boolean(isCoordinator) == true){
        const teacherCoordinatorExits = await this.teacherRepository.findOne({
          where: {
            isCoordinator: isCoordinator,
            teachingCareer:{
              centerCareer:{
                career:{
                  id: career
                },
                regionalCenter:{
                  id: regionalCenter
                }
              }
            }
          },
        });

        if(teacherCoordinatorExits){
          throw new ConflictException('Ya existe un coordinador academico para está carrera')
        }
      }

      const Emailteacher = await this.teacherRepository.findOne({
        where: {
          email: email.toLowerCase(),
          user: {
            dni: Not(dni.replaceAll('-', '')),
          },
        },
      });

      const centerCareer = await this.centerCareerRepository.findOne({
        where: {
          career: {
            id: career.toUpperCase(),
          },
          regionalCenter: {
            id: regionalCenter.toUpperCase(),
          },
        },
      });

      if (!centerCareer) {
        throw new NotFoundException(
          'La Carrera no existe en el centro regional proporcionado.',
        );
      }

      if (Emailteacher) {
        throw new ConflictException(
          'El Correo electrónico ya está siendo usado por otro Docente.',
        );
      }

      const generatePassword = await this.encryptService.generatePassword();
      const encripPassword = await this.encryptService.encodePassword(
        generatePassword,
      );

      const newTeacher = await this.teacherRepository.create({
        employeeNumber: userTeacher.employeeNumber
          ? userTeacher.employeeNumber
          : await this.generateEmployeeNumberService.generate(Number(count)),
        institutionalEmail: await this.generateEmailService.generate(
          others.firstName,
          others.secondName,
          others.firstLastName,
          others.secondLastName,
          this.teacherRepository,
          '@unah.edu.hn',
        ),
        photoOne,
        email: email.toLowerCase(),
        password: encripPassword,
        isBoss: isBoss || false,
        isCoordinator: isCoordinator || false,
      });

      if (!newTeacher) {
        throw new BadRequestException('No se ha podido crear al docente');
      }

      const teacherCareer = await this.teacherCareerRepository.create({
        centerCareer: {
          idCenterCareer: centerCareer.idCenterCareer,
        },
        teacher: {
          employeeNumber: newTeacher.employeeNumber,
        },
      });

      await this.userRepository.save(userTeacher);

      newTeacher.user = userTeacher;

      await this.teacherRepository.save(newTeacher);

      await this.teacherCareerRepository.save(teacherCareer);

      const returnUser = { ...JSON.parse(JSON.stringify(newTeacher.user)) };
      returnUser.teacher = { ...JSON.parse(JSON.stringify(newTeacher)) };
      returnUser.centerCareer = {
        ...JSON.parse(JSON.stringify(teacherCareer)),
      };
      returnUser.teachingCareer = returnUser.centerCareer.idTeachingCareer;
      returnUser.centerCareer =
        returnUser.centerCareer.centerCareer.idCenterCareer;
      delete returnUser.teacher.user;
      delete returnUser.student;
      await this.sendEmailService.sendCreationRegister(
        returnUser,
        generatePassword,
        'teacher',
      );

      return {
        statusCode: 200,
        message: this.printMessageLog('El docente se ha creado exitosamente'),
        user: returnUser,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async login({ employeeNumber, email, password }: LoginTeacherDto) {
    try {
      const user = await this.teacherRepository.findOne({
        where: {
          employeeNumber,
        },
        relations: ['user','teachingCareer','teachingCareer.centerCareer','teachingCareer.centerCareer.career','teachingCareer.centerCareer.regionalCenter'],
      });

      if (!user) {
        throw new BadRequestException('El Usuario no existe.');
      }

      const ispassword = await this.encryptService.decodePassword(
        password,
        user.password,
      );
      if (!ispassword) {
        throw new UnauthorizedException('Contraseña invalida.');
      }

      let returnUser = { ...JSON.parse(JSON.stringify(user.user)) };
      returnUser.teacher = JSON.parse(JSON.stringify(user));
      delete returnUser.teacher.user;
      delete returnUser.teacher.password;
      delete returnUser.password;

      return {
        authenticated: true,
        user: returnUser,
        statusCode: 200,
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async changeBoss({employeeNumber}: ChangeRolTeacherDto){
    try {
      const teacherExits = await this.teacherRepository.findOne({
        where: {
          employeeNumber: employeeNumber
        },
        relations: ['teachingCareer','teachingCareer.centerCareer','teachingCareer.centerCareer.career','teachingCareer.centerCareer.regionalCenter']
      });

      if(!teacherExits){
        throw new NotFoundException('El docente no se ha encontrado.')
      }

      if(Boolean(teacherExits.status) == false){
        throw new ConflictException('El docente no esta activo actualmente.')
      }

      if(teacherExits.isBoss){
        throw new ConflictException('El docente ya es jefe de la carrera enviada actualmente.')
      }

      if(teacherExits.isCoordinator){
        throw new ConflictException('El docente es actualmente coordinador de la carrera enviada.')
      }

      const teacherIsBossExits = await this.teacherRepository.findOne({
        where: {
          isBoss: true,
          teachingCareer: {
            centerCareer:{
              career:{
                id: JSON.parse(JSON.stringify(teacherExits.teachingCareer[0].centerCareer)).career.id
              },
              regionalCenter:{
                id: JSON.parse(JSON.stringify(teacherExits.teachingCareer[0].centerCareer)).regionalCenter.id
              }
            }
          },
        }
      });

      if(teacherIsBossExits){
        throw new ConflictException('Para este departamento ya existe un jefe.')
      }

      const teacherCreate = await this.teacherRepository.preload({
        employeeNumber: employeeNumber,
        isBoss: true,
        // photoOne: "jajajajaja"
      });

      const saveChangeTeacher = await this.teacherRepository.save(teacherCreate);

      return {
        message: "Jefe de departamento cambiado exitosamente",
        teacher: saveChangeTeacher,
        statusCode: 200,
      };

    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async changeCoordinator({employeeNumber}: ChangeRolTeacherDto){
    try {
      const teacherExits = await this.teacherRepository.findOne({
        where: {
          employeeNumber: employeeNumber
        },
        relations: ['teachingCareer','teachingCareer.centerCareer','teachingCareer.centerCareer.career','teachingCareer.centerCareer.regionalCenter']
      });

      if(!teacherExits){
        throw new NotFoundException('El docente no se ha encontrado.')
      }

      if(Boolean(teacherExits.status) == false){
        throw new ConflictException('El docente no esta activo actualmente.')
      }

      if(teacherExits.isBoss){
        throw new ConflictException('El docente ya tiene el cargo de jefe de la carrera enviada actualmente.')
      }

      if(teacherExits.isCoordinator){
        throw new ConflictException('El docente es actualmente coordinador de la carrera enviada.')
      }

      const teacherIsCoordinatorExits = await this.teacherRepository.findOne({
        where: {
          isCoordinator: true,
          teachingCareer: {
            centerCareer:{
              career:{
                id: JSON.parse(JSON.stringify(teacherExits.teachingCareer[0].centerCareer)).career.id
              },
              regionalCenter:{
                id: JSON.parse(JSON.stringify(teacherExits.teachingCareer[0].centerCareer)).regionalCenter.id
              }
            }
          },
        }
      });

      if(teacherIsCoordinatorExits){
        throw new ConflictException('Para está carrera ya existe un coordinador academico.')
      }

      const teacherCreate = await this.teacherRepository.preload({
        employeeNumber: employeeNumber,
        isCoordinator: true,
        // photoOne: "jajajajaja"
      });

      const saveChangeTeacher = await this.teacherRepository.save(teacherCreate);

      return {
        message: "Coordinador de Carrera cambiado Exitosamente",
        teacher: saveChangeTeacher,
        statusCode: 200,
      };

    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async changePassword(
    id: string,
    { password, newPassword }: ChangePasswordTeacherDto,
  ) {
    try {
      const user = await this.teacherRepository.findOne({
        where: {
          user: {
            dni: id.replaceAll('-', ''),
          },
        },
      });

      if (!user) {
        throw new NotFoundException('El Docente no se ha encontrado.');
      }

      const ispassword = await this.encryptService.decodePassword(
        password,
        user.password,
      );
      if (!ispassword) {
        throw new UnauthorizedException('Contraseña invalida.');
      }

      const encripPassword = await this.encryptService.encodePassword(
        newPassword,
      );

      const teacherChange = await this.teacherRepository.preload({
        employeeNumber: user.employeeNumber,
        password: encripPassword,
      });

      await this.teacherRepository.save(teacherChange);

      return {
        statusCode: 200,
        // user,
        message: this.printMessageLog(
          'La contraseña se ha cambiado exitosamente',
        ),
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async update(
    id: string,
    { email, video, photoOne, description, ...updateTeacher }: UpdateTeacherDto,
  ) {
    try {
      const teacher = await this.teacherRepository.findOne({
        where: {
          user: {
            dni: id.replaceAll('-', ''),
          },
        },
        relations: ['user'],
      });

      if (!teacher) {
        throw new NotFoundException('El Docente no se ha encontrado.');
      }

      email = email ? email.toLowerCase() : email;

      const updateChangeTeacher = await this.teacherRepository.preload({
        employeeNumber: teacher.employeeNumber,
        video,
        photoOne,
        description,
        email: email,
      });

      const updateUser = await this.userRepository.preload({
        dni: id.replaceAll('-', ''),
        ...updateTeacher,
      });

      const saveTeacher = await this.teacherRepository.save(
        updateChangeTeacher,
      );
      const saveUser = await this.userRepository.save(updateUser);

      const returnTeacher = JSON.parse(JSON.stringify(saveUser));
      returnTeacher.teacher = JSON.parse(JSON.stringify(saveTeacher));
      delete returnTeacher.teacher.user;

      return {
        statusCode: 200,
        user: returnTeacher,
        message: this.printMessageLog(
          'El Usuario se ha Actualizado Exitosamente',
        ),
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async findAll() {
    const allTeachers = await this.teacherRepository.find({ relations: ['user','teachingCareer','teachingCareer.centerCareer','teachingCareer.centerCareer.career','teachingCareer.centerCareer.regionalCenter'] });
    return {
      statusCode: 200,
      message: 'Los docentes han sido devueltos exitosamente.',
      teachers: allTeachers,
    };
  }

  async findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  async findCareer(career: string, center: string) {
    try {
      const careerExist = await this.teacherCareerRepository.find({
        where:{
          centerCareer: {
            career:{
              id: career.toUpperCase()
            },
            regionalCenter:{
              id: center.toUpperCase()
            }
          }
        },
        relations:['teacher','teacher.user']
      })
      const careerCenterExist = await this.centerCareerRepository.find({
        where:{
          career:{
            id: career.toUpperCase()
          },
          regionalCenter:{
            id: center.toUpperCase()
          }
        },
        // relations:['career']
      })

      if (!careerCenterExist) {
        throw new NotFoundException('La carrera no existe en este centro regional')
      }

      if (!careerExist) {
        throw new NotFoundException('No se han encontrado docentes')
      }

      return {
        statusCode: 200,
        message: this.printMessageLog(
          'Docentes obtenidos exitosamente',
        ),
        teachers: careerExist
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  async resetPassword({ dni }: ResetPasswordTeacherDto) {
    try {
      const user = await this.teacherRepository.findOne({
        where: {
          user: {
            dni: dni.replaceAll('-', ''),
          },
        },
        relations: ['user'],
      });

      if (!user) {
        throw new NotFoundException('El Usuario no se ha encontrado.');
      }

      const generatePassword = await this.encryptService.generatePassword();
      const encripPassword = await this.encryptService.encodePassword(
        generatePassword,
      );

      const teacherChange = await this.teacherRepository.preload({
        employeeNumber: user.employeeNumber,
        password: encripPassword,
      });
      teacherChange.user = user.user;

      const secretKey = 'miClaveSecreta';
      let currentDate = Math.floor(Date.now() / 1000)
      const dateExp = (currentDate) + (2*60);
      const token = jwt.sign({exp:dateExp}, secretKey);
      // console.log(fechaExpiracion - fechaActual)
      const tokenModified = token.replaceAll('.','$')
      await this.teacherRepository.save(teacherChange);
      await this.sendEmailService.sendNewPassword(
        teacherChange,
        generatePassword,
        'teacher',
        '',
        tokenModified,
        dni
      );
      
      return {
        statusCode: 200,
        message: this.printMessageLog(
          'La contraseña se ha cambiado exitosamente',
        ),
        // token:token
      };
    } catch (error) {
      return this.printMessageError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }

  validateUrl(tokenURl: string){
    tokenURl = tokenURl.replaceAll('$','.')
    const secretKey = 'miClaveSecreta';
      try {
        const decoded = jwt.verify(tokenURl, secretKey);
        // const decoded = jwt.verify(tokenURl, secretKey,{ ignoreExpiration: true });
        const currentDate = Math.floor(Date.now() / 1000);
        const dateExp = JSON.parse(JSON.stringify(decoded)).exp;

        if(currentDate<dateExp){
          return {
            success:true,
            message: "La url está actualmente vigente",
            // time: `Tiempo restante: ${dateExp- currentDate}`
          };
        } 
        return {
          success: false,
          message: "La url ha expirado o es invalida"
        };
      } catch (error) {
        return {
          success: false,
          message: "La url ha expirado o es invalida"
        };
      }
  }

  printMessageLog(message) {
    this.logger.log(message);
    return message;
  }

  printMessageError(message) {
    if (message.response) {
      if (message.response.message) {
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
