import { ExceptionalCancellation } from 'src/exceptional-cancellation/entities/exceptional-cancellation.entity';
import { Section } from 'src/section/entities/section.entity';
import { Student } from 'src/student/entities/student.entity';
import {
  Collection,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Tuition')
export class Tuition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.accountNumber)
  @JoinColumn({
    name: 'idStudent',
  })
  student: Student;

  @ManyToOne(() => Section, (section) => section.tuitions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idSection',
  })
  section: Section;

  @Column('text', {
    nullable: true,
  })
  note: string;

  @Column('text', {
    nullable: true,
  })
  stateClass: string;

  @Column('text', {
    default: false,
  })
  waitingList: boolean;

  @Column('text', {
    nullable: true,
  })
  teacherEvaluation: string;

  @Column('timestamptz', {
    default: () => 'current_timestamp',
  })
  create_at: Date;

  @ManyToOne(
    () => ExceptionalCancellation,
    (exceptionalCancellation) => exceptionalCancellation.id,
    { nullable: true },
  )
  @JoinColumn({
    name: 'idCancellation',
  })
  idCancellation: ExceptionalCancellation;
}
