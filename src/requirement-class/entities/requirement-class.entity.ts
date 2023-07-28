import { Class } from "src/class/entities/class.entity";
import { Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('RequirementClass')
export class RequirementClass {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Class, (class1) => class1.requirementClass
    )
    idRequirement: Class;


    @ManyToOne(
        () => Class, (class2) => class2.classCurrent
    )
    idClass: Class;


}
