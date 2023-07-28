import { Career } from "src/career/entities/career.entity";
import { CenterCareer } from "src/center-career/entities/center-career.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";


@Entity('TeachingCareer')
export class TeachingCareer {

    @PrimaryColumn('text',{
        nullable: false
    })
    idTeachingCareer: string;

    @ManyToOne(() => Teacher, (teacher) => teacher.teachingCareer)
    @JoinColumn({
        name: 'idTeacher',
    })
    teacher?: Teacher[];


    @ManyToOne(() => CenterCareer, (CenterCareer) => CenterCareer.teachingCareer)
    @JoinColumn({   
        name: 'idCenterCareer',
    })
    centerCareer?: CenterCareer[];


}
