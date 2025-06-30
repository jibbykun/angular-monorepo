import { Controller, Get } from '@nestjs/common';

@Controller('audit-log')
export class AuditLogController {
  @Get()
  getAuditLog(): string[] {
    return [
      'User A created task 1',
      'User B updated task 2',
      'User C deleted task 3',
    ];
  }
}
