import { CareerClass } from 'src/career-class/entities/career-class.entity';
import { Career } from 'src/career/entities/career.entity';
import { RequirementClass } from 'src/requirement-class/entities/requirement-class.entity';
import { Section } from 'src/section/entities/section.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Class')
export class Class {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  code: string;

  @Column('text')
  name: string;

  @Column('smallint', {
    nullable: false,
  })
  valueUnits: string;

  @Column('text')
  departmentId: string;

  @OneToMany(
    () => RequirementClass,
    (requirementClass) => requirementClass.idRequirement,
  )
  requirementClass: RequirementClass;

  @OneToMany(
    () => RequirementClass,
    (requirementClass) => requirementClass.idClass,
  )
  classCurrent: RequirementClass[];

  @OneToMany(() => CareerClass, (careerClass) => careerClass.idClass)
  careerClass: CareerClass;

  @OneToMany(() => Section, (section) => section.idClass)
  section: Section;

  @ManyToOne(() => Career, (career) => career.class)
  @JoinColumn({ name: 'departmentId' })
  career: Career;
}
