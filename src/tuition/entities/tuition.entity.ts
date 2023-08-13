import { ExceptionalCancellation } from 'src/exceptional-cancellation/entities/exceptional-cancellation.entity';
import { Section } from 'src/section/entities/section.entity';
import { Student } from 'src/student/entities/student.entity';
import { TeacherEvaluation } from 'src/teacher-evaluation/entities/teacher-evaluation.entity';
import {
  Collection,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum classStatus {
  PROGRESS = 'En progreso',
  APPROVED = 'APR',
  FAILED = 'REPR',
  NOTPRESENT = 'NSP',
  ABANDONED = 'ABN',
}

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

  @Column({
    type: 'enum',
    enum: classStatus,
    default: classStatus.PROGRESS,
  })
  stateClass: classStatus;

  @Column('text', {
    default: false,
  })
  waitingList: boolean;

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

  @Column('text', {
    default: false,
    nullable: true,
  })
  teacherEvaluationDone: boolean;

  @OneToMany(
    () => TeacherEvaluation,
    (teacherEvaluation) => teacherEvaluation.tuition,
  )
  teacherEvaluations: TeacherEvaluation[];
}
