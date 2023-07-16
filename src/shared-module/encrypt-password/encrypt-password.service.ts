import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class EncryptPasswordService {


    async encodePassword(password : string){

        const encryptPassword = bcrypt.hashSync( password, 10);

        return encryptPassword;

    }

    async decodePassword(password: string, encriptPassword: string){

        if(!bcrypt.compareSync( password , encriptPassword ) ){
            throw new UnauthorizedException('Contraseña invalida.');
        }

        return true;

    }

    async generatePassword(){

        const newPassword = await Math.random().toString(36).substring(7);

        return newPassword;

    }


}
