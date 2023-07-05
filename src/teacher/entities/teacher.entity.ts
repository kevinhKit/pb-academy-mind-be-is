import { Role } from "src/role/entities/role.entity";
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
    
    @OneToOne(
        () => User,
        user => user.teacher
    )
    @JoinColumn({
        name:"idUser"
    })
    dni: String;

    @OneToOne(
        () => Role,
        role => role.teacher
    )
    @JoinColumn({
        name: "idRole"
    })
    role: String;
    
    


}
