import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router ,RouterModule } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { NgIf, CommonModule } from '@angular/common';
import { NavigationEnd } from '@angular/router';
// import { Login } from "./auth/login/login";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule,Header,Footer,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App {
  isLoggedIn = false;
  showLayout = true;

  constructor(private router: Router) {
   this.router.events.subscribe(event => {
  if (event instanceof NavigationEnd) {
    const currentUrl = event.urlAfterRedirects;

    const noLayoutRoutes = ['/', '/signup','/login', '/unauthorized'];
    const isNoLayoutRoute = noLayoutRoutes.some(route => currentUrl === route);

    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' &&
                      currentUrl !== '/login';

    this.showLayout = !isNoLayoutRoute;
  }
});
  }
}