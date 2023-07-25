import { Column, Entity, PrimaryColumn } from "typeorm";

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
    exceptionalCancellationSate: boolean;


}


