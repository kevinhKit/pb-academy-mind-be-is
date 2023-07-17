import { Injectable, Logger } from '@nestjs/common';
import { info } from 'console';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {


    private transporter;
    private readonly logger = new Logger('loggerTransporter');

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
  
    async sendCreationRegister(user: any,pass:string, message: string,to:string =  process.env.EMAIL_FROM) {
      console.log(user)
      const contentSubject = {
        admin: "Bienvenido a nuestro sistema, políticas de seguridad...",
        teacher: "",
        student: "¡Bienvenido al sistema de registro de la UNAH!"
      };
    
      const info = await this.transporter.sendMail({
        from: await process.env.EMAIL_FROM,
        to: "kevin.davidhr@gmail.com",
        // subject: await contentSubject[String(user.type)],
        subject: "Bienvenido a nuestro sistema, políticas de seguridad...",
        text: `Estimad@ ${user.firstName} ${user.firstLastName}, sus credenciales de acceso a nuestros sistemas son:
        \nNúmero de Empleado: ${user.employeeNumber}
        \nNombre: ${user.firstName} ${user.secondName || ''} ${user.firstLastName} ${user.secondLastName}\nCorreo de Acceso: ${user.email}\nContraseña: ${pass}\n\n\nNota:\n"No debe compartir sus credenciales a ningún tercero para evitar problemas de seguridad."`

      });
      console.log(info)
    }
  
    async sendStartProcessTuition(to: string, resource: string){
  
    }

    
  
  



}
