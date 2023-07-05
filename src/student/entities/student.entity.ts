import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";



@Entity('Students')

export class Student {

    @PrimaryColumn('text')
    accountNumber: string;

    @Column('text')
    InstitutionalEmail: String;


    @Column('text')
    payment: String;

    @OneToOne(
        () => User,
        user => user.student
    )
    @JoinColumn({
        name: "idUser"
    })
    dni: string;




    


}
