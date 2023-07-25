import { Building } from "src/building/entities/building.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('RegionalCenter')
export class RegionalCenter {

    @PrimaryColumn('smallint',{
        unique: true
      })
    id: number;
    
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


}
