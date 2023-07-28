import { Section } from "src/section/entities/section.entity";
import { Student } from "src/student/entities/student.entity";
import { Collection, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Tuition')
export class Tuition {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Student, (student) => student.accountNumber)
    @JoinColumn({
        name: 'idStudent',
    })
    student?: Student;


    @ManyToOne(() => Section, (section) => section.id)
    @JoinColumn({
        name: 'idsection',
    })
    section?: Section;

    @Column('text')
    note: string;

    @Column('text')
    stateClass: string;

    @Column('text')
    waitingList: string;

    @Column('text')
    teacherEvaluation: string;

    @Column('text')
    idCancellation: string;



}
