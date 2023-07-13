import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class UserService {


  private readonly logger = new Logger('userLogger');

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {

    try{
      const user = await  this.userRepository.findOne({where: {
        dni: createUserDto.dni
      }}) 

      if(user){
        throw new ConflictException('Él usuario ya existe.')
      }
      const newPassword = await this.createPassword();
      const newUser = await this.userRepository.create({
        ...createUserDto,
        password: newPassword,
        isAdmin: true

      })

      await this.userRepository.save(newUser);

      this.logger.log('Se ha creado al usuario correctamente');
      return {
        message: "Se ha creado al usuario correctamente",
        statusCode: 200,
        newUser
      }
    } 
    catch (error){
      	this.logger.error(error);
        return error.response
    }
  }





  async login({email, password}: LoginUserDto){

    try{

      const user = await this.userRepository.findOne(
        {
          where:{
            email: await email.toLowerCase()
          }
        }
      )

      if(!user){
        throw new BadRequestException('El usuario no existe.')
      }

      if( !bcrypt.compareSync( password , user.password ) ){
       throw new UnauthorizedException('Contraseña invalida.');
      }
      // 

      

      
  
      return user;

    } catch(error){
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
    if (updateUserDto.password) {
      let authenticated;
      const user = await this.userRepository.findOne({
        where: { dni: id },
      });
      if (user) {
        authenticated = await bcrypt.compareSync( updateUserDto.password , user.password );
        // authenticated = await bcrypt.compare(
        //   updateUserDto.password,
        //   user.password,
        // );
        if (authenticated) {
          // const salt = await bcrypt.genSalt(10);
          // const newPassword = await bcrypt.hash(
          //   updateUserDto.newPassword,
          //   salt,
          // );
          const newPassword =await  this.createPassword()
          const success = await this.userRepository.update(
            { dni: id },
            { password: newPassword },
          );
          if (success) {
            throw new HttpException('Perfil actualizado.', HttpStatus.OK);
          }
        } else {
          throw new HttpException(
            'Contraseña Incorrecta.',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException(
          'No se pudo actualizar el perfil.',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (updateUserDto.description) {
    }
    return `Está acción actualiza al usuario con el id #${id}.`;
  }

  remove(id: number) {
    return `Está acción elimina al usuario con el id #${id}.`;
  }


  async createPassword(){
    const newPassword = Math.random().toString(36).substring(7);
    const password = await bcrypt.hashSync( newPassword, 10)
    return password;
  }




}
