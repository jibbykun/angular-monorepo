import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

// Mocks for ExecutionContext and request
const mockExecutionContext = (
  user: any,
  method = 'GET',
  requiredRoles: string[] = ['Admin']
) => {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user, method }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as any;
};

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    guard = new RolesGuard(reflector);
  });

  it('should allow if no required roles', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    const context = mockExecutionContext({ roles: [] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow Viewer on GET', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['Admin']);
    const context = mockExecutionContext(
      { roles: [{ name: 'Viewer' }] },
      'GET'
    );
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny Viewer on POST', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['Admin']);
    const context = mockExecutionContext(
      { roles: [{ name: 'Viewer' }] },
      'POST'
    );
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should allow if user has required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['Admin']);
    const context = mockExecutionContext(
      { roles: [{ name: 'Admin' }] },
      'POST'
    );
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny if user has no required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['Admin']);
    const context = mockExecutionContext({ roles: [{ name: 'User' }] }, 'POST');
    expect(guard.canActivate(context)).toBe(false);
  });
});
