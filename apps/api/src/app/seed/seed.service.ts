import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Organisation } from '../organisation/organisation.entity';
import { Role } from '../role/role.entity';
import { In } from 'typeorm';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Organisation) private orgRepo: Repository<Organisation>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedOrganisations();
    await this.seedUsers();
  }

  async seedOrganisations() {
    const count = await this.orgRepo.count();
    if (count === 0) {
      const orgs = [
        { id: 1, name: 'Alpha Corp' },
        { id: 2, name: 'Beta LLC' },
        { id: 3, name: 'Gamma Inc' },
      ];
      await this.orgRepo.save(orgs);
      console.log('Seeded organisations');
    }
  }

async seedUsers() {
  const count = await this.userRepo.count();
  if (count === 0) {
    const users = [
    {
        id: 1,
        name: 'Alice Admin',
        email: 'alice@example.com',
        organisationId: 1,
        roleNames: ['Owner'],
    },
    {
        id: 2,
        name: 'Bob Builder',
        email: 'bob@example.com',
        organisationId: 1,
        roleNames: ['Admin'],
    },
    {
        id: 3,
        name: 'Charlie Viewer',
        email: 'charlie@example.com',
        organisationId: 2,
        roleNames: ['Viewer'],
    },
    {
        id: 4,
        name: 'Diana Developer',
        email: 'diana@example.com',
        organisationId: 2,
        roleNames: ['Admin'],
    },
    ];

    for (const user of users) {
      const org = await this.orgRepo.findOneBy({ id: user.organisationId });

      // 🔍 Find roles by name
      const roles = await this.roleRepo.find({
        where: { name: In(user.roleNames) }
      });

      const newUser = this.userRepo.create({
        id: user.id,
        name: user.name,
        organisation: org,
        email: user.email,
        roles: roles,
      });

      await this.userRepo.save(newUser);
    }

    console.log('✅ Seeded users');
  }
}
}
