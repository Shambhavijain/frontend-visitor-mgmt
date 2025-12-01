import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { user } from '../../shared/models/model';
import { Loader } from '../../shared/components/loader/loader';
import { constString } from '../../shared/constants/constStr';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-user',
  imports: [FormsModule,CommonModule, Loader, ToastModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
  providers: [MessageService]
})
export class User implements OnInit {
  constString = constString
  isLoading = false;
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  // showSuccessMessage = false;

  users: user[] = [];
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.showList();
  }
  showList(): void {
    // this.showSuccessMessage = false;
    this.isLoading = true
    const subscription = this.userService.listUsers().subscribe({
      next: (data: any[]) => {
        this.users = data.map(user => ({
          name: user.username,
          email: user.email,
          role: user.role,
          address: user.address,
          flat_no: user.flat_no,
          tower: user.tower
        }));
        this.isLoading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Users Loaded',
          detail: 'User list fetched successfully',
            
        });

      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users',
            
        });

      }

    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    });
  }

  deleteUser(index: number): void {
    const userToDelete = this.users[index].name;
    this.isLoading = true;
    const subscription = this.userService.deleteUser(userToDelete).subscribe({
      next: (res) => {
        console.log(res.message);
        this.users.splice(index, 1);
        
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'User Deleted',
          detail: res.message || 'User deleted successfully',
           
        });
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Delete Failed',
          detail: 'Failed to delete user',
           
        });
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    });
  }
  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  

}

