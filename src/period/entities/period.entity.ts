import { Section } from "src/section/entities/section.entity";
import { StatePeriod } from "src/state-period/entities/state-period.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('Period')
export class Period {

    @PrimaryColumn('smallint',{
        nullable: false
    })
    id: number;

    @Column('smallint',{
        default: new Date().getFullYear(),
        nullable: false
    })
    year: number;

    @Column('smallint',{
        nullable: false
    })
    numberPeriod: number;

    // @Column('smallint')
    // status: number;

    @ManyToOne(
        () => StatePeriod, (statePeriod) => statePeriod.period
    )
    @JoinColumn({
        name: 'idPeriod'
    })
    idStatus: StatePeriod;

    @OneToMany(() => Section, (section) => section.idPeriod)
    section: Section;


}
