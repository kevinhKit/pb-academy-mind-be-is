import { Career } from 'src/career/entities/career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('CenterCareer')
export class CenterCareer {
  @PrimaryColumn('text')
  idCareer: string;

  @PrimaryColumn('text')
  idCenter: string;

  @ManyToOne(() => Career, (career) => career.id)
  @JoinColumn({ name: 'idCareer' })
  career: Career;

  @ManyToOne(() => RegionalCenter, (center) => center.id)
  @JoinColumn({ name: 'idCenter' })
  regionalCenter: RegionalCenter;

  @Column('timestamptz',{
    default: () => "current_timestamp"
  })
  create_at: Date;
}
