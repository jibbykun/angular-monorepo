import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  private roleSubject = new BehaviorSubject<string>('Admin'); 
  role$ = this.roleSubject.asObservable();

  setRole(role: string) {
    this.roleSubject.next(role);
  }

  getRole() {
    return this.roleSubject.getValue();
  }

}
