import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity'; 
import { Organisation } from './organisation/organisation.entity'; 
import { Role } from './role/role.entity'; 
import { Permission } from './permission/permission.entity'; 
import { Task } from './task/task.entity'; 
import { TasksModule } from './task/task.module';
import { MockUserMiddleware } from './common/middleware/mock-user.middleware';
import { UserModule } from './user/user.module';
import { OrganisationModule } from './organisation/organisation.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',          
      entities:  [
        User,
        Organisation,
        Role,
        Permission,
        Task
      ],               
      synchronize: true,              
    }),
    TasksModule,   
    UserModule,
    OrganisationModule,  
    AuditLogModule,      
    SeedModule         
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MockUserMiddleware).forRoutes('*');
  }
}