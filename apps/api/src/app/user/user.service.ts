import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Organisation } from '../organisation/organisation.entity';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Organisation) private orgRepo: Repository<Organisation>,
    @InjectRepository(Role) private roleRepo: Repository<Role>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      relations: ['organisation'],
    });
  }

  async findById(id: number): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['organisation'],
    });
  }

async create(data: {
  id?: number;
  email: string;
  roleIds: number[];
  organisationId: number;
}): Promise<User> {
  const organisation = await this.orgRepo.findOneBy({ id: data.organisationId });
  const roles = await this.roleRepo.find({
    where: { id: In(data.roleIds) },
  });

  const user = new User();
  if (data.id) {
    user.id = data.id;
  }
  user.email = data.email;
  user.organisation = organisation;
  user.roles = roles;

  return this.userRepo.save(user);
}



  async delete(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
