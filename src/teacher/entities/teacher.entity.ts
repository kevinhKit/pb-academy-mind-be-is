import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('Teacher')
export class Teacher {
  @PrimaryColumn('text')
  employeeNumber: string;

  @Column('text')
  institutionalEmail: string;

  @Column('text', {
    nullable: true,
  })
  video: string;

  @Column({ type: 'boolean', name: 'isTeacher', nullable: true })
  isTeacher: boolean;

  @Column({ type: 'boolean', name: 'isBoss', nullable: true })
  isBoss: boolean;

  @Column({ type: 'boolean', name: 'isCoordinator', nullable: true })
  isCoordinator: boolean;

  @Column({ type: 'boolean', name: 'isAdmin', nullable: true })
  isAdmin: boolean;

  @OneToOne(() => User, (user) => user.teacher)
  @JoinColumn({
    name: 'idUser',
  })
  user: User;
}
