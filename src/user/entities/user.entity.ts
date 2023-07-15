import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('User')

export class User {
  @PrimaryColumn('text',{
    unique: true
  })
  dni: string;

  @Column('text',{
    unique: true,
    default: null
  })
  email: string;

  @Column('text',{
    unique: true
  })
  employeeNumber: string;

  @Column('text')
  firstName: string;

  @Column('text')
  secondName: string;

  @Column('text')
  firstLastName: string;

  @Column('text')
  secondLastName: string;

  @Column('text')
  password: string;

  @Column('text', {
    nullable: true,
  })
  address: string;

  @Column('text', {
    nullable: true,
  })
  phone: string;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('text', {
    nullable: true,
  })
  photoOne: string;

  @Column('text', {
    nullable: true,
  })
  photoTwo: string;

  @Column('text', {
    nullable: true,
  })
  photoThree: string;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false
  })
  isAdmin: boolean;

  @Column('timestamp',{
    default: () => "current_timestamp"
  })
  create_at: Date;

  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean

  @OneToOne(() => Student, (student) => student.user)
  student: string;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: string;
}
