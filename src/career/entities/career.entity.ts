import { Column } from "typeorm";

export class Career {

    @Column('text',{
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

}
