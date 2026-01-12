import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Loader } from '../../shared/components/loader/loader';
import { constString } from '../../shared/constants/constStr';
import { ApiResponse } from '../../shared/models/api.response.model';
import { User } from '../../shared/models/user.model';


@Component({
  selector: 'app-user',
  imports: [FormsModule, CommonModule, Loader, ToastModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  providers: [MessageService]
})
export class UserComponent implements OnInit {
  constString = constString
  isLoading = false;
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);

  users: User[] = [];

  constructor(private userService: UserService, private router: Router) { }
  pageSize = 5;
  currentPage = 1;
  ngOnInit(): void {
    this.showList();
  }
  showList(): void {
    this.isLoading = true;

    const subscription = this.userService.listUsers().subscribe({
      next: (response: ApiResponse<User[]>) => {
        const usersData = response?.data ?? [];

        this.users = usersData.map((u: User) => ({
          id: u.id ?? '',
          username: u.username ?? '',
          email: u.email ?? '',
          role: u.role ?? '',
          address: u.address ?? '',
          flat_no: u.flat_no ?? '',
          tower: u.tower ?? '',
        }));
        this.currentPage = 1;


        this.isLoading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Users Loaded',
          detail: response.message || 'User list fetched successfully',
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

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteUser(index: number): void {
    const userToDelete = this.users[index].id;
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


get totalPages(): number {
  return Math.ceil(this.users.length / this.pageSize);
}

get paginatedUsers(): User[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.users.slice(start, start + this.pageSize);
}

changePage(page: number) {
  this.currentPage = page;
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


}

