import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const token = localStorage.getItem('authToken');

    if (!token) {
    this.router.navigate(['/unauthorized'], { replaceUrl: true });
      return false;
    }

   try {

  const payload = JSON.parse(atob(token.split('.')[1]));
  const role = payload.role;

  if (expectedRole === role) {
    return true;
  } else {
   this.router.navigate(['/unauthorized'], { replaceUrl: true });
    return false;
  }
} catch (error) {
  console.error('Token decoding failed:', error);
 this.router.navigate(['/unauthorized'], { replaceUrl: true });
  return false;

    }
  }
}








// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

// @Injectable({
//   providedIn:'root'
// })
// export class RoleGuard implements CanActivate{
//   constructor(private router:Router){}
// canActivate(route: ActivatedRouteSnapshot):boolean {
//   const expectedRole = route.data['role'];
  
// const actualRole = localStorage.getItem('userRole');

//     if (expectedRole === actualRole) {
//       return true;
//     }else{ 
// this.router.navigate(['/unauthorized']);
//     return false;
//     }
// }
// };
