import { Section } from 'src/section/entities/section.entity';
import { StatePeriod } from 'src/state-period/entities/state-period.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum numberPeriodOptions {
  first = 1,
  second = 2,
  third = 3,
}

@Entity('Period')
export class Period {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('smallint', {
    default: new Date().getFullYear(),
    nullable: false,
  })
  year: number;

  @Column({
    type: 'enum',
    enum: numberPeriodOptions,
    nullable: false,
  })
  numberPeriod: number;

  @Column('boolean', {
    default: false,
  })
  replacementPaymentDate: boolean;

  @Column('boolean', {
    default: false,
  })
  exceptionalCancellationDate: boolean;

  @Column('timestamptz', {
    nullable: true,
  })
  exceptionalCancelationStarts: Date;

  @Column('timestamptz', {
    nullable: true,
  })
  exceptionalCancelationEnds: Date;

  @Column('timestamptz', {
    nullable: true,
  })
  dayOne: Date;

  @Column('timestamptz', {
    nullable: true,
  })
  dayTwo: Date;

  @Column('timestamptz', {
    nullable: true,
  })
  dayThree: Date;

  @Column('timestamptz', {
    nullable: true,
  })
  dayFour: Date;

  @Column('timestamptz', {
    nullable: true,
  })
  dayFive: Date;

  // FORMAT
  // "exceptionalCancellationDate": "2023-08-06T01:13:00.127Z"

  // @Column('smallint')
  // status: number;

  @ManyToOne(() => StatePeriod, (statePeriod) => statePeriod.period)
  @JoinColumn({
    name: 'idStatePeriod',
  })
  idStatePeriod: StatePeriod;

  @OneToMany(() => Section, (section) => section.idPeriod)
  section: Section;
}
