import { Class } from "src/class/entities/class.entity";
import { Period } from "src/period/entities/period.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('Section')
export class Section {

    
    @PrimaryColumn('text')
    codeSection: string;

    @PrimaryColumn('text')
    @JoinColumn({
        name:"idPeriod"
    })
    @ManyToOne(
        () => Period, (period) => period.section
    )
    idPeriod: Period;

    @PrimaryColumn('text')
    @JoinColumn({
        name:"codeClass"
    })
    @ManyToOne(
        () => Class, (class1) => class1.section
    )
    codeClass: Class;

    @Column('text')
    idTeacher: string;

    @Column('text')
    space: string;

    @Column('text')
    days: string;

    @Column('text')
    idClassroom: string;

    @Column('text')
    hour: string;

    @Column('text')
    state: string;

    @Column('text')
    deletionJustification: string;

    @Column('timestamptz',{
        default: () => "current_timestamp"
      })
    create_at: Date;


}
