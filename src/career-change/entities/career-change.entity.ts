import { Career } from 'src/career/entities/career.entity';
import { Student } from 'src/student/entities/student.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

export enum applicationStatus {
  PROGRESS = 'En progreso',
  ACCEPTED = 'Aceptada',
  REJECTED = 'Rechazada',
}

@Entity('CareerChange')
export class CareerChange {
  @PrimaryColumn('text')
  accountNumber: string;

  @PrimaryColumn('text')
  idCareer: string;

  @ManyToOne(() => Student, (student) => student.accountNumber)
  @JoinColumn({ name: 'accountNumber' })
  student: Student;

  @ManyToOne(() => Career, (career) => career.id)
  @JoinColumn({ name: 'idCareer' })
  career: Career;

  @Column({ type: 'date', nullable: true })
  applicationDate: Date;

  @Column({
    type: 'enum',
    enum: applicationStatus,
    default: applicationStatus.PROGRESS,
  })
  applicationStatus: applicationStatus;

  @Column('text', { nullable: true })
  justification: string;

  @Column('text', { nullable: true })
  justificationPdf: string;

  @Column('timestamptz',{
    default: () => "current_timestamp"
  })
  create_at: Date;
}
