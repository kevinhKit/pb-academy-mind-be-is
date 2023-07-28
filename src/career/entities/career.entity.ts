import { CareerClass } from "src/career-class/entities/career-class.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('Career')
export class Career {

    @PrimaryColumn('text',{
        unique: true
    })
    id: string;

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

    @OneToMany(() => CareerClass, (careerClass) => careerClass.idClass)
    careerClass: CareerClass[];

    @Column('timestamptz',{
        default: () => "current_timestamp"
      })
    create_at: Date;

}
