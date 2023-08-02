import { Building } from 'src/building/entities/building.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('RegionalCenter')
export class RegionalCenter {
  @PrimaryColumn('text', {
    unique: true,
    nullable: false,
  })
  id: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  name: string;

  @Column('text')
  description: string;

  @OneToMany(() => Building, (building) => building.idRegionalCenter)
  building: Building;

  @Column('timestamptz', {
    default: () => 'current_timestamp',
  })
  create_at: Date;
}
