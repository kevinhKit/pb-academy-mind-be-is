import { Career } from 'src/career/entities/career.entity';
import { Student } from 'src/student/entities/student.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('CareerChange')
export class CareerChange {
  @PrimaryColumn('text')
  accountNumber: string;

  @PrimaryColumn('text')
  idCareer: string;

  @ManyToOne(() => Student, (student) => student.accountNumber)
  @JoinColumn({ name: 'accountNumber' })
  student: Student;

  @ManyToOne(() => Career, (career) => career.idCareer)
  @JoinColumn({ name: 'idCareer' })
  career: Career;
}
