import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { DashboardComponent } from './dashboard/dashboard-component/dashboard-component';
import { Unauthorized } from './shared/components/unauthorized/unauthorized';
import { RoleGuard } from './shared/guards/role-guard';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { User } from './admin/user/user';
import { Visitors } from './shared/components/visitors/visitors';
import { Gatekeeper } from './admin/gatekeeper/gatekeeper';
import { Signup } from './auth/signup/signup';

export const routes: Routes = [
    
  { path: '', component: Login }, 
  {path:'signup', component:Signup},
 
{
    path: 'admin-dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'admin' },
  },
  
 {
    path: 'admin-dashboard/manage-users',
    component: User,
    canActivate: [RoleGuard],
    data: { role: 'admin' }
  },
  
 {
    path: 'admin-dashboard/manage-visitors',
    component: Visitors,
    canActivate: [RoleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin-dashboard/manage-gatekeepers',
    component: Gatekeeper,
    canActivate: [RoleGuard],
    data: { role: 'admin' }
  },

  {
    path: 'gatekeeper-dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'gatekeeper' }
  },
  {
  path: 'gatekeeper-dashboard/manage-visitors',
  component: Visitors,
  canActivate: [RoleGuard],
  data: { role: 'gatekeeper' }
},

{
    path: 'owner-dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'owner' } 
  },
   {
  path: 'owner-dashboard/manage-visitors',
  component: Visitors,
  canActivate: [RoleGuard],
  data: { role: 'owner' }
  
}
,
    { path: 'login', component: Login },
    { path: 'unauthorized', component: Unauthorized },
    {path:'**' , component:PageNotFound }

];
