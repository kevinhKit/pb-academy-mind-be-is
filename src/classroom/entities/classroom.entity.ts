import { Building } from "src/building/entities/building.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('Classroom')
export class Classroom {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true,
        nullable:false,
        // default: null
      })
    code: string;


    @ManyToOne(
        () => Building, (building) => building.id,
    )
    @JoinColumn({name:"idBuilding"})
    idBuilding: Building;
}
