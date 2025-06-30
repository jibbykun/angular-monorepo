import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Put,
  Delete,
  Req
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { TaskOwnerGuard } from '../common/guards/task-owner.guard';

@Controller('tasks')
@UseGuards(RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Admins and Owners can view all tasks
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Owner')
  @Get()
  getTasks(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  // Only task owner or same-org user can view a specific task
  @UseGuards(TaskOwnerGuard)
  @Get(':id')
  getTask(@Param('id') id: number) {
    return this.taskService.findById(id);
  }

  // Admins and Owners can create tasks
  @Roles('Admin', 'Owner')
  @Post()
  createTask(@Body() task: Partial<Task>): Promise<Task> {
    return this.taskService.create(task);
  }

  @UseGuards(TaskOwnerGuard)
  @Put(':id')
  async updateTask(@Param('id') id: number, @Body() update: Partial<Task>, @Req() req) {
    const task = await this.taskService.update(id, update);

    console.log(`[AUDIT] User ${req.user.id} updated task ${id}`);
    return task;
  }

  @UseGuards(TaskOwnerGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Req() req) {
    await this.taskService.remove(id);

    console.log(`[AUDIT] User ${req.user.id} deleted task ${id}`);
    return { message: 'Deleted successfully' };
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Owner')
  @Get('/audit-log')
  getAuditLog(): string[] {
    return ['[AUDIT] User 1 created task 123', '[AUDIT] User 2 deleted task 456'];
  }

}
