import { CenterCareer } from 'src/center-career/entities/center-career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { Student } from 'src/student/entities/student.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

export enum applicationStatus {
  PROGRESS = 'En progreso',
  ACCEPTED = 'Aceptada',
  REJECTED = 'Rechazada',
}

@Entity('CenterChange')
export class CenterChange {
  @PrimaryColumn('text')
  accountNumber: string;

  @PrimaryColumn('smallint')
  id: number;

  @ManyToOne(() => Student, (student) => student.accountNumber)
  @JoinColumn({ name: 'accountNumber' })
  student: Student;

  @ManyToOne(() => CenterCareer, (centerCareer) => centerCareer.idCenterCareer)
  @JoinColumn({ name: 'centerCareer' })
  centerCareer: CenterCareer;

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

  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @Column('timestamptz',{
    default: () => "current_timestamp",
  })
  opinionDate: Date;
}
