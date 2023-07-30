import { Period } from 'src/period/entities/period.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Rol {
  DEFINNING = 'Por definir',
  PLANIFICATION = 'Planificacion',
  REGISTRATION = 'Matricula',
  ONGOING = 'En curso',
  GRADES = 'Ingreso de notas',
  FINISHED = 'Finalizado',
}

@Entity('StatePeriod')
export class StatePeriod {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: Rol,
    default: Rol.DEFINNING,
  })
  name: string;

  @Column('boolean', {
    default: false,
  })
  replacementPaymentDate: boolean;

  @Column('boolean', {
    default: false,
  })
  exceptionalCancellationDate: boolean;

  @OneToMany(() => Period, (period) => period.idStatePeriod)
  period: Period;
}
