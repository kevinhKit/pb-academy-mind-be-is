import { Building } from "src/building/entities/building.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('Classroom')
export class Classroom {


    @PrimaryColumn('text',{
        unique: true,
      })
    id: string;

    @Column('text',{
        unique: true,
        // nullable:true,
        // default: null
      })
    code: string;


    @ManyToOne(
        () => Building, (building) => building.classroom,
    )
    @JoinColumn({name:"idBuilding"})
    idBuilding: Building;
}
