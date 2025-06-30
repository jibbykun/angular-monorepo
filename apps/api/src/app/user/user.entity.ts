import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Organisation } from '../organisation/organisation.entity';
import { Role } from '../role/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @ManyToOne(() => Organisation, (org) => org.users)
  organisation: Organisation;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
