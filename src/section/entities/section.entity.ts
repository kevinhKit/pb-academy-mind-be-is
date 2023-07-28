import { Class } from "src/class/entities/class.entity";
import { Classroom } from "src/classroom/entities/classroom.entity";
import { Period } from "src/period/entities/period.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('Section')
export class Section {

    
    @PrimaryColumn('text')
    codeSection: string;

    // @PrimaryColumn('text')
    // @Column('text')
    @ManyToOne(
    () => Period, (period) => period.id
    )
    @JoinColumn({
        name:"idPeriod"
    })
    idPeriod: Period;

    // @PrimaryColumn('text')
    // @Column('text')
    @ManyToOne(
        () => Class, (class1) => class1.id
        )
    @JoinColumn({
        name:"idClass"
    })
    idClass: Class;

    // @Column('text')
    @ManyToOne(
        () => Teacher, (teacher) => teacher.employeeNumber
    )
    @JoinColumn({
        name: "idTeacher"
    })
    idTeacher: Teacher;

    @Column('text')
    space: string;

    @Column('text')
    days: string;

    // @Column('text')
    @ManyToOne(
        () => Classroom, (clssroom) => clssroom.id
    )
    @JoinColumn({
        name: "idClassroom"
    })
    idClassroom: Classroom;

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
