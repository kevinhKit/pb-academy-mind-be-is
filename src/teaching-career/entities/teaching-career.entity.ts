import { Career } from "src/career/entities/career.entity";
import { CenterCareer } from "src/center-career/entities/center-career.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('TeachingCareer')
export class TeachingCareer {

    @PrimaryGeneratedColumn('uuid')
    idTeachingCareer: string;

    @ManyToOne(() => Teacher, (teacher) => teacher.teachingCareer)
    @JoinColumn({
        name: 'idTeacher',
    })
    teacher?: Teacher;


    @ManyToOne(() => CenterCareer, (CenterCareer) => CenterCareer.teachingCareer)
    @JoinColumn({   
        name: 'idCenterCareer',
    })
    centerCareer?: CenterCareer;

    @Column({
        type: 'boolean',
        default: true
      })
    status: boolean;

    @Column('timestamptz',{
        default: () => "current_timestamp"
      })
    create_at: Date;


}
