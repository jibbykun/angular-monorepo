import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TaskService } from '../../task/task.service';

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(private taskService: TaskService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const taskId = +req.params.id;

    const task = await this.taskService.findById(taskId);

    const isOwner = task?.assignedTo?.id === user.id;
    const isSameOrg = task?.organisation?.id === user.organization?.id;
    const isPrivilegedRole = user.roles?.some(role => ['Admin', 'Owner'].includes(role.name));

    return isOwner || isSameOrg || isPrivilegedRole; 
  }
}

