
import { Section } from 'src/section/entities/section.entity';
import { TeachingCareer } from 'src/teaching-career/entities/teaching-career.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('Teacher')
export class Teacher {
  @PrimaryColumn('text',{
    unique: true
  })
  employeeNumber: string;

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
    default: null
  })
  video: string;

  @Column('text', {
    nullable: true,
    default: null
  })
  photoOne: string;

  @Column('text', {
    nullable: true,
    default: null
  })
  description: string;

  //  @Column('timestamp',{
  //   default: () => "current_timestamp"
  // })
  
  // @Column('timestamp',{default: () => "current_timestamp"})
  @Column('timestamptz',{default: () => "current_timestamp"})
  create_at: Date;

  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean

  @Column({ type: 'boolean',
    name: 'isBoss',
    default: false,
  })
  isBoss: boolean;

  @Column({
    type: 'boolean',
    default: false
  })
  isCoordinator: boolean;

  @OneToOne(() => User, (user) => user.teacher)
  @JoinColumn({
    name: 'idUser',
  })
  user: User;


  @OneToMany(() => TeachingCareer, (teachingCareer) => teachingCareer.teacher)
  teachingCareer: TeachingCareer;


  @OneToMany(() => Section, (section) => section.idTeacher)
  section: Section;
}
