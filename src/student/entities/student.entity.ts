import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('Students')
export class Student {
  @PrimaryColumn('text',{
    unique: true
  })
  accountNumber: string;

  @Column('text',{
    unique: true
  })
  institutionalEmail: string;

  @Column('text',{
    unique: true
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text', {
    nullable: true,
    default: `${Math.random() < 0.5}`
  })
  payment: string;

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

  @Column('smallint', {
    nullable: true,
  })
  currentPhoto: number;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('timestamptz',{
    default: () => "current_timestamp"
  })
  create_at: Date;

  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  // @Column({
  //   type: 'smallint',
  //   default: 0
  // })
  // incomeNote: number;

  @Column({
    type: 'smallint',
    default: 0
  })
  overallIndex: number;

  @Column({
    type: 'smallint',
    default: 0
  })
  periodIndex: number;

  @OneToOne(() => User, (user) => user.student)
  @JoinColumn({
    name: 'idUser',
  })
  user: User;

  @OneToMany(() => StudentCareer, (studentCareer) => studentCareer.student)
  studentCareer: StudentCareer;

  @OneToMany(
    () => Tuition,
    (tuition) => tuition.student,
  )
  tution: Tuition[];
}
