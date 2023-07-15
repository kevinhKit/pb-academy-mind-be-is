import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateSharedModuleDto } from './dto/create-shared-module.dto';
import { UpdateSharedModuleDto } from './dto/update-shared-module.dto';

@Injectable()
export class SendEmailService {

  private transporter;

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
  }

  async sendCreationRegister(user: any = process.env.EMAIL_FROM, message: string) {
    const contentSubject = {
      admin: "Bienvenido a nuestro sistema, políticas de seguridad...",
      teacher: "",
      student: "¡Bienvenido al sistema de registro de la UNAH!"
    };
  
    const info = await this.transporter.sendMail({
      from: await process.env.EMAIL_FROM,
      to: user.email,
      subject: await contentSubject[String(user.type)],
      text: `Estimad@ ${user.firstName} ${user.secondName || ''} ${user.firstLastName} ${user.secondLastName}, sus credenciales de acceso a nuestros sistemas son:\n
      Correo de Acceso: ${user.email}\nContraseña ${user.newPassword}\n\n\nNota:\n"No debe compartir sus credenciales a ningún tercero para evitar problemas de seguridad."`
    });
  }

  async sendStartProcessTuition(to: string, resource: string){

  }


}
