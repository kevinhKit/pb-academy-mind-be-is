import { Career } from "src/career/entities/career.entity";
import { Student } from "src/student/entities/student.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";


@Entity('StudentCareer')
export class StudentCareer {

    @PrimaryColumn('text')
    idTeachingCareer: string;

    @ManyToOne(() => Student, (student) => student.studentCareer)
    @JoinColumn({
        name: 'idTeacher',
    })
    student?: Student[];


    @ManyToOne(() => Career, (career) => career.studentCareer)
    @JoinColumn({   
        name: 'idCareer',
    })
    career?: Career[];


}
