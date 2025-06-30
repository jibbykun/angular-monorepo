import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { Organisation } from '../organisation/organisation.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Organisation) private orgRepository: Repository<Organisation>,
  ) {}


  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async create(taskDto: any): Promise<Task> {
    const task = new Task();
    task.title = taskDto.title;
    task.completed = taskDto.completed || false;

    if (taskDto.assignedTo?.id) {
      task.assignedTo = await this.userRepository.findOneBy({ id: taskDto.assignedTo.id });
    }

    if (taskDto.organization?.id) {
      task.organisation = await this.orgRepository.findOneBy({ id: taskDto.organization.id });
    }

    return this.taskRepository.save(task);
  }

    findById(id: number) {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['assignedTo', 'organisation'],
    });
  }

  async findAllScoped(user: any): Promise<Task[]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .leftJoinAndSelect('task.organisation', 'organisation');

    if (user.roles.some((r) => r.name === 'Owner')) {
      return query.getMany();
    }

    if (user.roles.some((r) => r.name === 'Admin' || r.name === 'Viewer')) {
      return query
        .where('organisation.id = :orgId', { orgId: user.organisation.id })
        .getMany();
    }

    return [];
  }

  async update(id: number, update: Partial<Task>): Promise<Task> {
    const task = await this.findById(id);
    Object.assign(task, update);
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}

