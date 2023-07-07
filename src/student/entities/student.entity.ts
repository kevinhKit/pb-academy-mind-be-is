import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('Students')
export class Student {
  @PrimaryColumn('text')
  accountNumber: string;

  @Column('text')
  institutionalEmail: string;

  @Column('text', {
    nullable: true,
  })
  payment: string;

  @Column('text')
  career: string; // CAMBIAR ESTO AL IMPLEMENTAR LA CARRERA

  @OneToOne(() => User, (user) => user.student)
  @JoinColumn({
    name: 'idUser',
  })
  user: User;
}
