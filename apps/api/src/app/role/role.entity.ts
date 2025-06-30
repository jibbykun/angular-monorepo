import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from '../permission/permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
