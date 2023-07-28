import { CareerClass } from "src/career-class/entities/career-class.entity";
import { StudentCareer } from "src/student-career/entities/student-career.entity";
import { TeachingCareer } from "src/teaching-career/entities/teaching-career.entity";
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

    @OneToMany(() => TeachingCareer, (teachingCareer) => teachingCareer.career)
    teachingCareer: string;

    @OneToMany(() => StudentCareer, (studentCareer) => studentCareer.career)
    studentCareer: string;

    @OneToMany(() => CareerClass, (careerClass) => careerClass.idClass)
    careerClass: string;

    @Column('timestamptz',{
        default: () => "current_timestamp"
      })
      create_at: Date;

}
