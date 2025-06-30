import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { UserModule } from '../user/user.module';
import { OrganisationModule } from '../organisation/organisation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule, OrganisationModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TasksModule {}
