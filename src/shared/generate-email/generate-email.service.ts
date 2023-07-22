import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateEmailService {

    async generate(nombre1, nombre2, apellido1, apellido2, repository, dominio = '@unah.hn') {
        nombre1 = this.removeAccents(nombre1.trim().toLowerCase());
        nombre2 = this.removeAccents(nombre2.trim().toLowerCase());
        apellido1 = this.removeAccents(apellido1.trim().toLowerCase());
        apellido2 = this.removeAccents(apellido2.trim().toLowerCase());

        // apellido2 = this.removeAccents(apellido2.toLowerCase()) || "";
        let emailCreate = `${nombre1}.${apellido1}${dominio}`;
        if ( await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }

        emailCreate = `${nombre1.charAt(0)}${nombre2.charAt(0)}.${apellido1}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }

        emailCreate = `${nombre1.charAt(0)}${nombre2.charAt(0)}.${apellido2}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }

        emailCreate = `${nombre2}.${apellido1}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }

        emailCreate = `${apellido1}${apellido2[0]}${nombre1}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${apellido2}${nombre2}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }

        emailCreate = `${nombre1}.${apellido2}${apellido1[0]}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }

        emailCreate = `${nombre1}.${apellido2}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }

        emailCreate = `${nombre1.charAt(0)}${apellido1.charAt(0)}.${apellido2}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${nombre1.charAt(0)}${apellido1.charAt(0)}${apellido2.charAt(0)}${apellido1}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${nombre1.charAt(0)}${apellido1.charAt(0)}${apellido2.charAt(0)}${apellido2}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${nombre1.charAt(0)}${apellido1.charAt(0)}.${apellido1}${apellido2.charAt(0)}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${nombre1.charAt(0)}${apellido1.charAt(0)}.${apellido2}${apellido1.charAt(0)}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${nombre1.charAt(0)}${apellido1.charAt(0)}${apellido2.charAt(0)}${apellido1}${apellido2.charAt(0)}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${nombre1.charAt(0)}${apellido1.charAt(0)}${apellido2.charAt(0)}${apellido2}${apellido1.charAt(0)}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${apellido2}${nombre1}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${apellido1}${nombre2}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${apellido2}${apellido1[0]}${nombre2}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${apellido1}${nombre1}${nombre2[0]}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${nombre1}${apellido1}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${apellido2[0]}${apellido1}${nombre1}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${apellido2}.${nombre1}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        emailCreate = `${apellido1}${nombre1}${dominio}`;
        if (await this.mailAvailable(emailCreate, repository)) {
          return emailCreate;
        }
      
        return `${nombre1}${nombre2}.${apellido1}${apellido2[0]}${Math.floor(Math.random() * 90000) + 10000}${dominio}`;
    }


    removeAccents(texto) {
        let textoSinAcentos = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        textoSinAcentos = textoSinAcentos.replace(/ñ/gi, "n");
        return textoSinAcentos
    }
      
    async mailAvailable(emailCreate, repository) {

      return (await repository.findOne({
        where:{
          institutionalEmail: emailCreate
        }
      })) ? false : true
    }

      
      
      


}
