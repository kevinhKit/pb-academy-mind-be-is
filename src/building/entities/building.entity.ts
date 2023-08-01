import { Classroom } from "src/classroom/entities/classroom.entity";
import { RegionalCenter } from "src/regional-center/entities/regional-center.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('Building')
export class Building {

    @PrimaryGeneratedColumn('uuid')
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
        () => RegionalCenter, (regionalCenter) => regionalCenter.id
    )
    @JoinColumn({name:"idRegionalCenter"})
    idRegionalCenter: RegionalCenter;

    // @OneToMany(
    //     () => Classroom, (classroom) => classroom.idBuilding
    // )
    // classroom: Classroom;


}
