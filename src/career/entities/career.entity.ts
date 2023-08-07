import { CareerClass } from 'src/career-class/entities/career-class.entity';
import { Class } from 'src/class/entities/class.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('Career')
export class Career {
  @PrimaryColumn('text', {
    unique: true,
    nullable: false,
  })
  id: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  raceCode: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'smallint',
    default: 700,
    nullable: false,
  })
  minimumIncomeValue: number;

  @OneToMany(() => CareerClass, (careerClass) => careerClass.idClass)
  careerClass: CareerClass[];

  @Column('timestamptz', {
    default: () => 'current_timestamp',
  })
  create_at: Date;

  @OneToMany(() => Class, (classs) => classs.career)
  class: Class;
}
