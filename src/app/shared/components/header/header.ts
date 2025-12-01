import { Component, ElementRef, HostListener, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { constString } from '../../constants/constStr';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  imports: [NgIf, FormsModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  encapsulation: ViewEncapsulation.None
})

export class Header {
   showDropdown = false;
 

  toggleDropDown(event:MouseEvent):void{
    event.stopPropagation();
    this.showDropdown=!this.showDropdown
  }
  @HostListener('document:click')
  closeDropDown():void{
    this.showDropdown=false;
  }

  constString = constString
  private router = inject(Router);
  private userService = inject(UserService);
  appName = 'Visitor Management System';
  role = localStorage.getItem('userRole');
  userId = localStorage.getItem('userId');
  flatno = localStorage.getItem('flatNumber');
  tower = localStorage.getItem('tower');
  userIconPath = '/icon.png';
  update_profile = '/Update_profile.png'
  user_logout = '/Logout_User.png'
 

  email: string = '';
  username: string = '';


  ngOnInit() {
   
    if (this.role === 'owner') {
      this.userService.getCurrentUser().subscribe(user => {
        this.email = user.email;
        this.username = user.username;
        console.log(this.email);
        console.log(this.username);
        this.email = '';
        this.username = '';
      });
    }
  }


 

  logout() {
    localStorage.clear();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('saved-login-form');
    this.router.navigate(['/login']);
  }
  update() {
    const updatedUser = { email: this.email, username: this.username };
    this.userService.updateUser(updatedUser).subscribe(() => {
      alert('Profile updated successfully!');

      const modalElement = document.getElementById('exampleModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

    });

  }

}
