import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MockAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerRole = req.headers['x-role'] || 'Admin'; 
    const role = Array.isArray(headerRole) ? headerRole[0] : headerRole;
    const orgId = parseInt(req.headers['x-org'] as string) || 1;
    const userId = parseInt(req.headers['x-user'] as string) || 1;

    (req as any).user = {
      id: userId,
      email: `mock+${role.toLowerCase()}@test.com`,
      roles: [{ name: role }],
      organisation: { id: orgId },
    };

    next();
  }
}
