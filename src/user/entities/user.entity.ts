import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('User')
// @Index('idx_unique_key',['dni','firstName'], {unique:true})
export class User {
  @PrimaryColumn('text')
  dni: string;

  @Column('text')
  firstName: string;

  @Column('text')
  secondName: string;

  @Column('text')
  firstLastName: string;

  @Column('text')
  secondLastName: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('text', {
    nullable: false,
  })
  address: string;

  @Column('text', {
    nullable: false,
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

  @Column({ nullable: true })
  isAdmin: boolean;

  @OneToOne(() => Student, (student) => student.dni)
  student: string;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: string;
}
