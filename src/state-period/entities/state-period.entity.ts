import { Period } from "src/period/entities/period.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

export enum Rol {
    STUDENT = "student",
    TEACHER = "teacher",
    USUARIO = "admin"
  }

  @Entity('StatePeriod')
export class StatePeriod {

    @PrimaryColumn('text',{
        nullable: false
    })
    id: string;


    @Column({
        type: 'enum',
        enum: Rol,
        default: Rol.USUARIO,
        // nullable: false
    })
    name: string;
    
    
    @Column('boolean')
    replacementPaymentDate: boolean;
    
    
    @Column('boolean')
    exceptionalCancellationDate: boolean;

    @OneToMany(
        () => Period, (period) => period.idStatus
    )
    period: Period;


}


