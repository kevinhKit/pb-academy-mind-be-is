import { TeachingCareer } from "src/teaching-career/entities/teaching-career.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('Career')
export class Career {

    @PrimaryColumn('text',{
        unique: true
    })
    idCareer: string;

    @Column('text',{
        unique: true
    })
    raceCode: string;

    @Column('text')
    name: string;

    @Column({
        type: 'smallint',
        default: 700
    })
    minimumIncomeValue: number;

    @OneToMany(() => TeachingCareer, (teachingCareer) => teachingCareer.career)
    teachingCareer: string;

}
