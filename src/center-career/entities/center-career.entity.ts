import { Career } from 'src/career/entities/career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('CenterCareer')
export class CenterCareer {
  @PrimaryColumn('text')
  idCareer: string;

  @PrimaryColumn('smallint')
  id: number;

  @ManyToOne(() => Career, (career) => career.idCareer)
  @JoinColumn({ name: 'idCareer' })
  career: Career;

  @ManyToOne(() => RegionalCenter, (center) => center.id)
  @JoinColumn({ name: 'id' })
  regionlCenter: RegionalCenter;
}
