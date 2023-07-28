import { flatten } from '@nestjs/common';
import { Career } from 'src/career/entities/career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { TeachingCareer } from 'src/teaching-career/entities/teaching-career.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('CenterCareer')
export class CenterCareer {

  
  @PrimaryColumn('text',{
    nullable: false
  })
  idCenterCareer: string;
  
  // @PrimaryColumn('text')
  // idCareer: string;

  // @PrimaryColumn('text')
  // idCenter: string;

  @ManyToOne(() => Career, (career) => career.id)
  @JoinColumn({ name: 'idCareer' })
  career: string;

  @ManyToOne(() => RegionalCenter, (center) => center.id)
  @JoinColumn({ name: 'idCenter' })
  regionalCenter: string;

  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @Column('timestamptz',{
    default: () => "current_timestamp"
  })
  create_at: Date;

  @OneToMany(() => StudentCareer, (studentCareer) => studentCareer.centerCareer)
  studentCareer: StudentCareer[];
  
  @OneToMany(() => TeachingCareer, (teachingCareer) => teachingCareer.centerCareer)
  teachingCareer: StudentCareer[];


}
