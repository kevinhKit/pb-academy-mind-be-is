import { flatten } from '@nestjs/common';
import { Career } from 'src/career/entities/career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { StudentCareer } from 'src/student-career/entities/student-career.entity';
import { TeachingCareer } from 'src/teaching-career/entities/teaching-career.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CenterCareer')
export class CenterCareer {

  
  @PrimaryGeneratedColumn('uuid')
  // @PrimaryColumn('text')
  idCenterCareer: string;
  
  // @PrimaryColumn('text')
  // idCareer: string;

  // @PrimaryColumn('text')
  // idCenter: string;

  @ManyToOne(() => Career, (career) => career.id)
  @JoinColumn({ name: 'career' })
  career: Career;

  @ManyToOne(() => RegionalCenter, (center) => center.id)
  @JoinColumn({ name: 'regionalCenter' })
  regionalCenter: RegionalCenter;

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
  studentCareer: StudentCareer;
  
  @OneToMany(() => TeachingCareer, (teachingCareer) => teachingCareer.centerCareer)
  teachingCareer: TeachingCareer;


}
