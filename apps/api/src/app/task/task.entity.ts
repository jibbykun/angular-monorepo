import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Organisation } from '../organisation/organisation.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, { nullable: true })
  assignedTo: User;

  @ManyToOne(() => Organisation)
  organisation: Organisation;
}
