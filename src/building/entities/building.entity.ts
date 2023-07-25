import { Classroom } from "src/classroom/entities/classroom.entity";
import { RegionalCenter } from "src/regional-center/entities/regional-center.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('Building')
export class Building {

    @PrimaryColumn('text',{
        unique: true,
      })
    id: string;

    @Column('text',{
        unique: true,
        nullable:true,
        default: null
      })
    name: string;


    @Column('text',{
        unique: true,
        nullable:true,
        default: null
      })
    location: string;


    @ManyToOne(
        () => RegionalCenter, (regionalCenter) => regionalCenter.building
    )
    @JoinColumn({name:"idRegionalCenter"})
    idRegionalCenter: string;

    @OneToMany(
        () => Classroom, (classroom) => classroom.idBuilding
    )
    classroom: Classroom;


}
