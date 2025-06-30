import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from './organisation.entity';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation])],
  providers: [OrganisationService],
  controllers: [OrganisationController],
  exports: [OrganisationService, TypeOrmModule],
})
export class OrganisationModule {}