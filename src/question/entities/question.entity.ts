import { TeacherEvaluation } from 'src/teacher-evaluation/entities/teacher-evaluation.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Question')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
  })
  question: string;

  @OneToMany(
    () => TeacherEvaluation,
    (teacherEvaluation) => teacherEvaluation.id,
  )
  teacherEvaluation: TeacherEvaluation;
}
