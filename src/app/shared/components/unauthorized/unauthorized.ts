import { Component, inject } from '@angular/core';
import { constString } from '../../constants/constStr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css'
})
export class Unauthorized {
  constString = constString
private router=inject(Router)

  goToLogin(): void {
  this.router.navigate(['/login'], { replaceUrl: true });
}
}
