import { Student } from "src/student/entities/student.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('User')
// @Index('idx_unique_key',['dni','firstName'], {unique:true})
export class User {

    @PrimaryColumn('text')
    dni: String;

    @Column('text')
    firstName: string;

    @Column('text')
    secondName: String;

    @Column('text')
    firstLastName: String;

    @Column('text')
    secondLastName: String;

    @Column('text')
    email: String;

    @Column('text')
    password: String;

    @Column('text',{
        nullable: false
    })
    address: String;

    @Column('text',{
        nullable: false
    })
    phone: String;

    @Column('text')
    description: String;

    @Column('text')
    photoOne: String;

    @Column('text')
    photoTwo: String;

    @Column('text')
    photoThree: String;

    @OneToOne(
        () => Student,
        student => student.dni
    )
    student: string; 
    
    @OneToOne(
        () => Teacher,
        teacher => teacher.dni
    )
    teacher: string; 

}
