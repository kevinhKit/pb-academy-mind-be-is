import { Career } from "src/career/entities/career.entity";
import { Class } from "src/class/entities/class.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";


@Entity('CareerClass')
export class CareerClass {

    @PrimaryColumn('text')
    id: string;

    @ManyToOne(() => Class, (class1) => class1.classCurrent)
    @JoinColumn({
        name: 'idClass',
    })
    // idClass?: Class;
    idClass?: Class[];


    @ManyToOne(() => Career, (career) => career.careerClass)
    @JoinColumn({   
        name: 'idCareer',
    })
    // idCareer?: Career;
    idCareer?: Career[];



}
