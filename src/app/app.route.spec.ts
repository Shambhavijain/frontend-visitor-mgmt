import { routes } from './app.routes';
import { RoleGuard } from './shared/guards/role-guard';

describe('App Routes Configuration', () => {

  it('should contain login and signup routes', () => {
    const paths = routes.map(r => r.path);
    expect(paths).toContain('');
    expect(paths).toContain('signup');
    expect(paths).toContain('login');
  });

  it('should protect dashboard routes with RoleGuard', () => {
    const dashboardRoutes = routes.filter(r =>
      r.path?.includes('dashboard')
    );

    dashboardRoutes.forEach(route => {
      expect(route.canActivate).toContain(RoleGuard);
    });
  });

  it('should define role data correctly', () => {
    const adminRoute = routes.find(r => r.path === 'admin-dashboard');
    expect(adminRoute?.data?.['role']).toBe('admin');

    const ownerRoute = routes.find(r => r.path === 'owner-dashboard');
    expect(ownerRoute?.data?.['role']).toBe('owner');

    const gatekeeperRoute = routes.find(r => r.path === 'gatekeeper-dashboard');
    expect(gatekeeperRoute?.data?.['role']).toBe('gatekeeper');
  });

  it('should contain wildcard route', () => {
    const wildcard = routes.find(r => r.path === '**');
    expect(wildcard).toBeDefined();
  });

});
