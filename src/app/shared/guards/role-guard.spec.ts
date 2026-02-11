import { RoleGuard } from './role-guard';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    guard = new RoleGuard(router);
    localStorage.clear();
  });

  function createToken(role: string): string {
    const payload = btoa(JSON.stringify({ role }));
    return `header.${payload}.signature`;
  }

  it('should allow access if role matches', () => {
    localStorage.setItem('authToken', createToken('admin'));

    const route = {
      data: { role: 'admin' }
    } as unknown as ActivatedRouteSnapshot;

    expect(guard.canActivate(route)).toBeTrue();
  });

  it('should deny access if role does not match', () => {
    localStorage.setItem('authToken', createToken('owner'));

    const route = {
      data: { role: 'admin' }
    } as unknown as ActivatedRouteSnapshot;

    expect(guard.canActivate(route)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized'], { replaceUrl: true });
  });

  it('should deny access if no token', () => {
    const route = {
      data: { role: 'admin' }
    } as unknown as ActivatedRouteSnapshot;

    expect(guard.canActivate(route)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized'], { replaceUrl: true });
  });

  it('should deny access if token is invalid', () => {
    localStorage.setItem('authToken', 'invalid.token');

    const route = {
      data: { role: 'admin' }
    } as unknown as ActivatedRouteSnapshot;

    expect(guard.canActivate(route)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized'], { replaceUrl: true });
  });
});
