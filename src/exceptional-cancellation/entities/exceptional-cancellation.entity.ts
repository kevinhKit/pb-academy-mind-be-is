import { Tuition } from 'src/tuition/entities/tuition.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum cancelationStatus {
  APPROVED = 'Aprobada',
  DENIED = 'Rechazada',
  PROGRESS = 'En progreso',
}
@Entity('ExceptionalCancellation')
export class ExceptionalCancellation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  reason: string;

  @Column('text', { default: false })
  justificationPdf: string;

  @Column({
    type: 'enum',
    enum: cancelationStatus,
    default: cancelationStatus.PROGRESS,
  })
  status: string;

  @ManyToOne(() => Tuition, (tuition) => tuition.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idTuition',
  })
  idTuition: Tuition;
}
