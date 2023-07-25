import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('RegionalCenter')
export class RegionalCenter {

    @PrimaryColumn('smallint',{
        unique: true
      })
    id: number;
    
    @Column('text')
    name: string;

    @Column('text')
    description: string;


}
