import { Career } from "src/career/entities/career.entity";
import { CenterCareer } from "src/center-career/entities/center-career.entity";
import { Student } from "src/student/entities/student.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";


@Entity('StudentCareer')
export class StudentCareer {

    @PrimaryColumn('text',{
        nullable: false
    })
    idStudentCareer: string;

    @ManyToOne(() => Student, (student) => student.studentCareer)
    @JoinColumn({
        name: 'idTeacher',
    })
    student?: Student[];

    @ManyToOne(() => CenterCareer, (centerCareer) => centerCareer.studentCareer)
    @JoinColumn({   
        name: 'idCenterCareer',
    })
    centerCareer?: CenterCareer[];


}
