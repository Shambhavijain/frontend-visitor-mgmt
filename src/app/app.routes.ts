import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { DashboardComponent } from './dashboard/dashboard-component/dashboard.component';
import { Unauthorized } from './shared/components/unauthorized/unauthorized';
import { RoleGuard } from './shared/guards/role-guard';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { UserComponent } from './admin/user/user.component';
import { Visitors } from './shared/components/visitors/visitors';
import { GatekeeperComponent } from './admin/gatekeeper/gatekeeper.component';
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
    component: UserComponent,
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
    component: GatekeeperComponent,
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
