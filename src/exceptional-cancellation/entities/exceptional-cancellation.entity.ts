import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('ExceptionalCancellation')
export class ExceptionalCancellation {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{ nullable: true })
    reason: string;

    @Column('text', { nullable: true })
    justificationPdf: string;



}
