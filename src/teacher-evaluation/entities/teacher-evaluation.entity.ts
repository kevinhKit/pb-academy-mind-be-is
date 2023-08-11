import { Question } from 'src/question/entities/question.entity';
import { Tuition } from 'src/tuition/entities/tuition.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum answerType {
  EXCELENT = 'Excelente',
  GREAT = 'Bueno',
  REGULAR = 'Intermedio',
  INSUFICCIENT = 'Insuficiente',
  DEFICCIENT = 'Deficiente',
}

@Entity('TeacherEvaluation')
export class TeacherEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: answerType,
    nullable: true,
  })
  answer: string;

  @Column('text', {
    nullable: true,
  })
  openAnswer: string;

  @ManyToOne(() => Tuition, (tuition) => tuition.id)
  @JoinColumn({
    name: 'idTuition',
  })
  tuition: Tuition;

  @ManyToOne(() => Question, (question) => question.id)
  @JoinColumn({
    name: 'idQuestion',
  })
  idQuestion: Question;
}
