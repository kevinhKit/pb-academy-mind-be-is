import { Column, Entity, PrimaryColumn } from "typeorm";

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

    @Column('smallint')
    status: number;


}
