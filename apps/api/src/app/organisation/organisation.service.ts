import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation } from './organisation.entity';

@Injectable()
export class OrganisationService {
  constructor(@InjectRepository(Organisation) private repo: Repository<Organisation>) {}

  findAll(): Promise<Organisation[]> {
    return this.repo.find();
  }
}
