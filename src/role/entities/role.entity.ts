import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('Role')
export class Role {
  @PrimaryColumn('text')
  idRole: String;

  @Column('text')
  name: String;

  @Column('text')
  description: String;
}
