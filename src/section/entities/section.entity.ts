import { Class } from 'src/class/entities/class.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { Period } from 'src/period/entities/period.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Section')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Period, (period) => period.id)
  @JoinColumn({
    name: 'idPeriod',
  })
  idPeriod: Period;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  codeSection: string;

  @ManyToOne(() => Class, (class1) => class1.id)
  @JoinColumn({
    name: 'idClass',
  })
  idClass: Class;

  @ManyToOne(() => Teacher, (teacher) => teacher.employeeNumber)
  @JoinColumn({
    name: 'idTeacher',
  })
  idTeacher: Teacher;

  @Column('text', {
    nullable: false,
  })
  space: string;

  @Column('text')
  days: string; //esto deberia ser un enum

  // @Column('text')
  @ManyToOne(() => Classroom, (clssroom) => clssroom.id)
  @JoinColumn({
    name: 'idClassroom',
  })
  idClassroom: Classroom;

  @Column('text', {
    nullable: false,
  })
  hour: string;

  @Column('text')
  state: string;

  @Column('text')
  deletionJustification: string;

  @Column('timestamptz', {
    default: () => 'current_timestamp',
  })
  create_at: Date;
}
