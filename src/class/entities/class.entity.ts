import { CareerClass } from "src/career-class/entities/career-class.entity";
import { RequirementClass } from "src/requirement-class/entities/requirement-class.entity";
import { Section } from "src/section/entities/section.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('Class')
export class Class {

    @PrimaryColumn('text')
    id: string;

    @Column('text',{
        nullable: false,
        unique: true
    })
    code: string;
    
    
    @Column('text')
    name: string;
    
    
    @Column('smallint',{
        nullable: false
    })
    valueUnits: string;


    @OneToMany(
        () => RequirementClass, (requirementClass) => requirementClass.idRequirement
    )
    requirementClass: RequirementClass;

    @OneToMany(
        () => RequirementClass, (requirementClass) => requirementClass.idClass
    )
    classCurrent: RequirementClass;

    @OneToMany(() => CareerClass, (careerClass) => careerClass.idClass)
    careerClass: CareerClass;

    @OneToMany(() => Section, (section) => section.idClass)
    section: Section;


}
