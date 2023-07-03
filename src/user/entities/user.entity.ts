import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('User')
// @Index('idx_unique_key',['dni','firstName'], {unique:true})
export class User {

    @PrimaryColumn('text')
    dni: String;

    @PrimaryColumn('text')
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

}
