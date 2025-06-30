import { Controller, Get } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { Organisation } from './organisation.entity';

@Controller('organisations')
export class OrganisationController {
  constructor(private orgService: OrganisationService) {}

  @Get()
  getOrganizations(): Promise<Organisation[]> {
    return this.orgService.findAll();
  }
}
