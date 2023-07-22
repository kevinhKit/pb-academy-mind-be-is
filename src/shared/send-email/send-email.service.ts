import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
require('dotenv').config();

@Injectable()
export class SendEmailService {


    private transporter;
    private readonly logger = new Logger('loggerTransporter2');

    constructor() {

      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: Boolean(process.env.SMTP_SECURE),
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      this.transporter.verify().then(() => {
        this.logger.log('Servicio de mensajes iniciado correctamente');
      });
      
    }
  
    async sendCreationRegister(user: any,pass:string, role: string,to:string =  process.env.EMAIL_FROM) {

      const contentSubject = {
        admin: "Bienvenido a nuestro sistema, se te ha asignado el rol de administrador",
        teacher: "Bienvenido a nuestro sistema, se te ha asignado el rol de docente",
        student: "¡Bienvenido al sistema de registro de la UNAH!"
      };
    
      const info = await this.transporter.sendMail({

        from: await process.env.EMAIL_FROM,

        to: `${role == "admin" ? `${user.email}`:`${role == "teacher" ? `${user.teacher.email}`:`${user.stundent.email}`}`}`,

        subject: await `${contentSubject[role]}`,

        
        
        text: `Estimad@ ${user.firstName} ${user.firstLastName}, sus credenciales de acceso a nuestros sistemas son:
        ${(role == "admin") ? `\nNúmero de Empleado: ${user.employeeNumber}`:`${role == "teacher" ? `\nNúmero de Empleado: ${user.teacher.employeeNumber}` :`` }`}
        \nNombre: ${user.firstName} ${user.secondName || ''} ${user.firstLastName} ${user.secondLastName}
        \nCorreo electrónico: ${(role == "admin") ? `${user.email}`:`${role=="teacher" ? `${user.teacher.institutionalEmail}` : `${user.student.institutionalEmail}`}`}
        \nContraseña: ${pass}
        ${(role == "teacher") ? `\n Url de inicio de Sesión: ${process.env.FE_API_URL}/admin/inicio-sesion ` : ``}
        \n\n¡IMPORTANTE!\nPara acceder a nuestro sistema debera ingresar su número de ${(role == "admin" || role == "teacher") ? `Empleado` : `Cuenta`} y contraseña, se recomienda cambiar la contraseña generada por el sistema a una que pueda ser recordada por el usuario.
        \nNOTA:\n"No debe compartir sus credenciales a ningún tercero para evitar problemas de seguridad."
        
        `
        // COLOCAR LA URL SI ES ADMINISTRADOR
      });
      // console.log(info)
    }
  
    async sendStartProcessTuition(to: string, resource: string){
  
    }

    
  
  



}
