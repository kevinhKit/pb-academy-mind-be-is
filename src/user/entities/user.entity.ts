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
    nullable:true,
    default: null
  })
  email: string;

  @Column('text',{
    unique: true,
    nullable: true,
    default: null
  })
  employeeNumber: string;

  @Column('text')
  firstName: string;

  @Column('text',{
    nullable: true,
    default:''
  })
  secondName: string;

  @Column('text')
  firstLastName: string;

  @Column('text')
  secondLastName: string;

  @Column('text',{
    nullable: true,
    default: null
  })
  password: string;

  @Column('text', {
    nullable: true,
    default: null
  })
  address: string;

  @Column('text', {
    nullable: true,
    default: null
  })
  phone: string;

  @Column('text', {
    nullable: true,
    default: null
  })
  description: string;

  // @Column('text', {
  //   nullable: true,
  // })
  // photoOne: string;

  // @Column('text', {
  //   nullable: true,
  // })
  // photoTwo: string;

  // @Column('text', {
  //   nullable: true,
  // })
  // photoThree: string;

  @Column({
    type: 'boolean',
    nullable: true,
    default: null
  })
  isAdmin: boolean;

  @Column('timestamptz',{
    default: () => "current_timestamp"
  })
  create_at: Date;

  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @Column('text', {
    nullable: true,
    default: null
  })
  photoOne: string;
  
  @OneToOne(() => Student, (student) => student.user)
  student: string;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: string;
}
