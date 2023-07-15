import { Career } from "src/career/entities/career.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";


@Entity('TeachingCareer')
export class TeachingCareer {

    @PrimaryColumn('text')
    idTeachingCareer: string;

    @ManyToOne(() => Teacher, (teacher) => teacher.teachingCareer)
    @JoinColumn({
        name: 'idTeacher',
    })
    teacher?: Teacher[];


    @ManyToOne(() => Career, (career) => career.teachingCareer)
    @JoinColumn({   
        name: 'idCareer',
    })
    career?: Career[];


}
