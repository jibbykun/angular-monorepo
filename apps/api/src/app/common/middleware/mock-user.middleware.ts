import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MockUserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const roleName = req.headers['x-user-role'] || 'Viewer';

    req.user = {
      id: 1,
      roles: [{ name: roleName }],
      organisation: { id: 1 },
    };

    next();
  }
}
