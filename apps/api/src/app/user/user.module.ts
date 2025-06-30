import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Organisation } from '../organisation/organisation.entity';
import { Role } from '../role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organisation, Role])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule], 
})
export class UserModule {}