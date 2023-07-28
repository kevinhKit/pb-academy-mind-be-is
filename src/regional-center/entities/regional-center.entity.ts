import { Building } from "src/building/entities/building.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('RegionalCenter')
export class RegionalCenter {

    @PrimaryColumn('text',{
        unique: true
      })
    id: string;
    
    @Column('text',{
      unique: true
    })
    name: string;

    @Column('text')
    description: string;

    @OneToMany(
      () => Building, (building) => building.idRegionalCenter
    )
    building: string;

    @Column('timestamptz',{
      default: () => "current_timestamp"
    })
    create_at: Date;


}
