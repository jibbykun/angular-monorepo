import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MockAuthService } from './mock-auth.service';
import { take, switchMap } from 'rxjs/operators';

export const mockAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(MockAuthService);

  return authService.role$.pipe(
    take(1),
    switchMap(role => {
      console.log('Sending request with role:', role);

      const headers = req.headers
        .set('x-user-role', role)
        .set('x-user', '1')
        .set('x-org', '1');

      const authReq = req.clone({ headers });

      return next(authReq);
    })
  );
};
