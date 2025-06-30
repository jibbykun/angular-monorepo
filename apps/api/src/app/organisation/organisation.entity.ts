import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Organisation, (org) => org.children, { nullable: true })
  parent: Organisation;

  @OneToMany(() => Organisation, (org) => org.parent)
  children: Organisation[];

  @OneToMany(() => User, (user) => user.organisation)
  users: User[];
}
