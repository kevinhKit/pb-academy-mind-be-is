import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('Class')
export class Class {

    @PrimaryColumn('text')
    id: string;

    @Column('text')
    code: string;
    
    
    @Column('text')
    name: string;
    
    
    @Column('smallint')
    valueUnits: string;


}
