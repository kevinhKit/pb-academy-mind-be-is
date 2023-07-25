import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { CareerModule } from './career/career.module';
import { SharedModule } from './shared/shared.module';
import { SendEmailService } from './shared/send-email/send-email.service';
import { RegionalCenterModule } from './regional-center/regional-center.module';
import { BuildingModule } from './building/building.module';
import { ClassroomModule } from './classroom/classroom.module';
import { StudentCareerModule } from './student-career/student-career.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      // -----------------------
      extra: {
        precision: {
          integer: 32,
          decimal: 10,
        },
      },
    }),
    UserModule,
    StudentModule,
    TeacherModule,
    RoleModule,
    AuthModule,
    CareerModule,
    SharedModule,
    RegionalCenterModule,
    BuildingModule,
    ClassroomModule,
    StudentCareerModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
