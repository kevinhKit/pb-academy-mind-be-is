import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

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

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('timestamp',{
    default: () => "current_timestamp"
  })
  create_at: Date;

  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @Column({
    type: 'smallint',
    default: 0
  })
  incomeNote: number;

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
}
