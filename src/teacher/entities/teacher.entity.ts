import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('Teacher')
export class Teacher {


    @PrimaryColumn('text')
    employeeNumber: String;
    
    @Column('text')
    institutionalEmail: String;
    
    @Column('text')
    video: String;
    
    @Column('text')
    idrole: String;
    
    
    @OneToOne(
        () => User,
        user => user.teacher
    )
    @JoinColumn({
        name:"idUser"
    })
    dni: String;
    
    


}