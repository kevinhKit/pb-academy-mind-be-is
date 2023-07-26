import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('Section')
export class Section {

    @PrimaryColumn('text')
    idPeriod: string;

    @PrimaryColumn('text')
    codeSection: string;

    @PrimaryColumn('text')
    codeClass: string;

    @Column('text')
    idTeacher: string;

    @Column('text')
    space: string;

    @Column('text')
    days: string;

    @Column('text')
    idClassroom: string;

    @Column('text')
    hour: string;

    @Column('text')
    state: string;

    @Column('text')
    deletionJustification: string;


}
