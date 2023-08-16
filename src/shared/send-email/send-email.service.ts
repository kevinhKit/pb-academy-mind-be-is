import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Student } from 'src/student/entities/student.entity';
import { StudentService } from 'src/student/student.service';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import { User } from 'src/user/entities/user.entity';
require('dotenv').config();

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
  
    async sendCreationRegister(user: any,pass:string, role: string,to:string =  process.env.EMAIL_FROM) {

      const contentSubject = {
        admin: "Bienvenido a nuestro sistema, se te ha asignado el rol de administrador",
        teacher: "Bienvenido a nuestro sistema, se te ha asignado el rol de docente",
        student: "¡Bienvenido al sistema de registro de la UNAH!"
      };
    
      const info = await this.transporter.sendMail({

        from: await process.env.EMAIL_FROM,

        to: `${role == "admin" ? `${user.email}`:`${role == "teacher" ? `${user.teacher.email}`:`${user.student.email}`}`}`,

        subject: await `${contentSubject[role]}`,

        text: `Estimad@ ${user.firstName} ${user.firstLastName}, sus credenciales de acceso a nuestros sistemas son:
        ${(role == "admin") ? `\nNúmero de Empleado: ${user.employeeNumber}`:`${role == "teacher" ? `\nNúmero de Empleado: ${user.teacher.employeeNumber}` :`${user.student.accountNumber}` }`}
        \nNombre: ${user.firstName} ${user.secondName || ''} ${user.firstLastName} ${user.secondLastName}
        \nCorreo electrónico: ${(role == "admin") ? `${user.email}`:`${role=="teacher" ? `${user.teacher.institutionalEmail}` : `${user.student.institutionalEmail}`}`}
        \nContraseña: ${pass}
        ${(role == "admin") ? `\n Url de inicio de Sesión: http://localhost:3000/admin/inicio-sesion` : ``}
        \n\n¡IMPORTANTE!\nPara acceder a nuestro sistema debera ingresar su número de ${(role == "admin" || role == "teacher") ? `Empleado` : `Cuenta`} y contraseña, se recomienda cambiar la contraseña generada por el sistema a una que pueda ser recordada por el usuario.
        \nNOTA:\n"No debe compartir sus credenciales a ningún tercero para evitar problemas de seguridad."
        `
      });

    }

    
  
    async sendNewPassword(user: any,pass:string, role: string,to:string =  process.env.EMAIL_FROM, token: string = "jajaja", dni: string = 'null'){
      const info = await this.transporter.sendMail({

        from: await process.env.EMAIL_FROM,

        to: `${role == "admin" ? `${user.email}`:`${role == "teacher" ? `${user.email}`:`${user.email}`}`}`,

        // subject: await `${contentSubject[role]}`,
        subject: await `Su contraseña se ha reseteado Exitosamente`,

        text: `Estimad@ ${user.user.firstName} ${user.user.firstLastName}, Su nueva contraseña es:
        \n${pass}
        ${(role == "teacher" ? `\nUrl de Reinicio: http://localhost:3000/reinicio-clave/${token}/${dni}` : ``)}
        \n\n¡IMPORTANTE!\nSe recomienda cambiar la contraseña generada por el sistema a una que pueda ser recordada por el usuario.
        \nNOTA:\n"No debe compartir sus credenciales a ningún tercero para evitar problemas de seguridad."
        `
      });
    }


    async sendStartProcessTuition(to: string, resource: string){
  
    }

    async sendRequestContact(sender: Student, recipient: Student){
      const info = await this.transporter.sendMail({
        from: await process.env.EMAIL_FROM,
        to: `${recipient.user.email}`,
        subject: await `Solicitud de contacto - Sistema de Registro Universitario`,
        text: `El estudiante ${sender.user.firstName.toUpperCase()} ${sender.user.firstLastName.toUpperCase()} quiere agregarte a sus contactos.\n\nNOTA:\n"Si le ha llegado por error este correo no difunda el contenido del mismo."`,
        html: `
          <div style="text-align: left;">
            <h2 style="text-align: center;">${sender.user.firstName} ${sender.user.secondName} ${sender.user.firstLastName} ${sender.user.secondLastName} cuenta: ${sender.accountNumber} quiere agregarte a sus contactos.</h2>
            <div style="text-align: center;">
              <a href="http://localhost:3000" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin: 0 auto;">Ir al Sistema</a>
            </div>
            <br>
            <p><strong>NOTA:</strong></p>
            <p>"Si le ha llegado por error este correo no difunda el contenido del mismo."</p>
          </div>
        `
      });
    }

    async sendNotification(sender: Tuition[]) {
      for (const senderItem of sender) {
        const info = await this.transporter.sendMail({
          from: await process.env.EMAIL_FROM,
          to: `${senderItem.student.email}`,
          subject: await `Notificación de calificaciones actualizadas en el sistema de registro, ${senderItem.section.idClass.name.toUpperCase()}`,
          text: '',
          html: `
            <div style="text-align: left;">
              <br><br>
              <p>Estimado/a ${senderItem.student.user.firstName.toUpperCase()} ${senderItem.student.user.secondName.toUpperCase()} ${senderItem.student.user.firstLastName.toUpperCase()} ${senderItem.student.user.secondLastName.toUpperCase()},</p>
              <p>Espero que este mensaje te encuentre bien. Nos complace informarte que tu docente de la clase "${senderItem.section.idClass.name.toUpperCase()}" ha subido las calificaciones al sistema de registro de la universidad.</p>
              <p>Las calificaciones están disponibles para que puedas consultarlas y evaluar tu desempeño en la clase. Te recomendamos que accedas al sistema de registro lo antes posible para revisar tus calificaciones y asegurarte de que todo esté correcto.</p>
              <p>Si tienes alguna pregunta o inquietud sobre tus calificaciones, te animamos a que te comuniques directamente con tu docente para obtener aclaraciones adicionales.</p>
              <p>Correo de tu docente: ${senderItem.section.idTeacher.institutionalEmail}</p>
              <p>Recuerda que es importante mantener un seguimiento constante de tus calificaciones y estar al tanto de tu progreso académico. Si necesitas apoyo adicional o tienes alguna dificultad, no dudes en buscar la asistencia de tu docente o de los recursos disponibles en la universidad.</p>
              <p>¡Te deseamos mucho éxito en tus estudios!</p>
              <br><br>
              <div style="text-align: center;">
                <a href="http://localhost:3000" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin: 0 auto;">Ir al Sistema</a>
              </div>
              <p>Atentamente,</p>
              <p>Sistema de Registro Universitario</p>
              <br><br>
              <p><strong>NOTA:</strong></p>
              <p>"Si le ha llegado por error este correo no difunda el contenido del mismo."</p>
            </div>
          `
        });
      }
    }
    

    
  
  

      // Atentamente,
      // [Tu nombre]
      // [Tu cargo o posición]
      // [Nombre de la universidad]

}
