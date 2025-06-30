import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Organisation } from '../organisation/organisation.entity';
import { Role } from '../role/role.entity'; // ✅ Import Role
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organisation, Role]) // ✅ Add Role here
  ],
  providers: [SeedService],
})
export class SeedModule {}
