import { RequirementClass } from "src/requirement-class/entities/requirement-class.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

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


    @OneToMany(
        () => RequirementClass, (requirementClass) => requirementClass.idRequirement
    )
    requirementClass: RequirementClass;

    @OneToMany(
        () => RequirementClass, (requirementClass) => requirementClass.idClass
    )
    classCurrent: RequirementClass;


}
