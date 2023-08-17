import { Period } from 'src/period/entities/period.entity';
import { Student } from 'src/student/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('RepositionRequest')
export class RepositionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    default: 'L 100',
  })
  price: string;

  @ManyToOne(() => Student, (student) => student.accountNumber)
  @JoinColumn({
    name: 'idStudent',
  })
  idStudent: Student;

  @ManyToOne(() => Period, (period) => period.id)
  @JoinColumn({
    name: 'idPeriod',
  })
  idPeriod: Period;

  @Column('text', {
    nullable: false
  })
  justification: string;
}
