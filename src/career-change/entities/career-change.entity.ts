import { Career } from 'src/career/entities/career.entity';
import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { Period } from 'src/period/entities/period.entity';
import { Student } from 'src/student/entities/student.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export enum applicationStatus {
  PROGRESS = 'En progreso',
  ACCEPTED = 'Aceptada',
  REJECTED = 'Rechazada',
}

@Entity('CareerChange')
export class CareerChange {

  @PrimaryGeneratedColumn('uuid')
  idCareerChange: string;


  @Column('text',{
    nullable: false,
    // unique: true
  })
  accountNumber: string;

  @Column('text',{
    nullable: false
  })
  idCareer: string;

  @ManyToOne(() => Student, (student) => student.accountNumber)
  @JoinColumn({ name: 'accountNumber' })
  student: Student;

  @ManyToOne(() => CenterCareer, (centerCareer) => centerCareer.idCenterCareer)
  @JoinColumn({ name: 'centerCareer' })
  centerCareer: CenterCareer;

  @Column('timestamptz',{
    default: () => "current_timestamp",
  })
  applicationDate: Date;

  @Column({
    type: 'enum',
    enum: applicationStatus,
    default: applicationStatus.PROGRESS,
  })
  applicationStatus: string;

  @Column('text', { nullable: true })
  justification: string;

  @Column('text', { nullable: true })
  justificationPdf: string;

  @Column('timestamptz',{
    default: () => "current_timestamp",
  })
  opinionDate: Date;

  @ManyToOne(() => Period, (period) => period.id)
  @JoinColumn({
    name: 'idPeriod',
  })
  idPeriod?: Period;
}
