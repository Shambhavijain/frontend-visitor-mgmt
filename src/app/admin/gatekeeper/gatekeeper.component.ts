// import { Component, DestroyRef, inject, OnInit } from '@angular/core';
// import { NgIf, NgFor, CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { GatekepeperService } from '../../shared/services/gatekeeper.service';
// import { Router } from '@angular/router';

// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';

// import { Loader } from '../../shared/components/loader/loader';
// import { constString } from '../../shared/constants/constStr';
// import { GatekeeperCreate, Gatekeeper } from '../../shared/models/gatekeeper.model';
// import { ApiResponse } from '../../shared/models/api.response.model';


// @Component({
//   selector: 'app-gatekeeper',
//   imports: [FormsModule, NgIf, NgFor, CommonModule, Loader, ToastModule],
//   templateUrl: './gatekeeper.component.html',
//   styleUrl: './gatekeeper.component.css'
// })
// export class GatekeeperComponent implements OnInit {
//   constString = constString
//   showAddGatekeeperModal = false;

//   isLoading = false;
//   private gatekeeperservice = inject(GatekepeperService)
//   private messageService = inject(MessageService);
//   private destroyRef = inject(DestroyRef);
//   private router = inject(Router)
//   newGatekeeper: GatekeeperCreate = { username: '', email: '', password: '', address: '' };
//   users: Gatekeeper[] = [];
//   ngOnInit(): void {
//     this.showList()
//   }

//   openAddGatekeeperModal() {
//     this.newGatekeeper = this.resetGatekeeperForm();
//     this.showAddGatekeeperModal = true;

//   }

//   closeAddGatekeeperModal() {
//     this.showAddGatekeeperModal = false;
//   }

//   submitGatekeeperForm() {
//     this.isLoading = true;
//     const subscription = this.gatekeeperservice.addGatekeeper(this.newGatekeeper).subscribe({
//       next: () => {

//         this.closeAddGatekeeperModal();


//         this.showList();
//         this.isLoading = false;
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Gatekeeper Added',
//           detail: 'Gatekeeper added successfully',

//         });
//       },
//       error: (err: any) => {
//         this.isLoading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to add gatekeeper',

//         });
//       }
//     });
//     this.closeAddGatekeeperModal();


//     this.destroyRef.onDestroy(() => {
//       console.log('Destroy ref of gatekeeper component called');
//       subscription.unsubscribe()


//     })
//   }

//   showList() {
//     this.isLoading = true;

//     this.gatekeeperservice.listsGatekeeper().subscribe({
//       next: (resp: ApiResponse<Gatekeeper[]>) => {

//         const arr = Array.isArray(resp?.data) ? resp.data : [];

//         this.users = arr.map((g: any) => ({
//           id: g.id,
//           username: g.username,
//           email: g.email,
//           address: g.address,
//           role: g.role ?? null,
//         }));

//         this.isLoading = false;

//         this.messageService.add({
//           severity: 'success',
//           summary: 'Gatekeepers Loaded',
//           detail: resp.message || 'Gatekeeper list fetched successfully',
//         });
//       },

//       error: () => {
//         this.isLoading = false;
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to load Gatekeepers',
//         });
//       }
//     });
//   }

//   deleteGatekeeper(index: number) {
//     this.isLoading = true;

//     const useridToDelete = this.users[index].id;

//     const subscription = this.gatekeeperservice.deletegatekeeper(useridToDelete)
//       .subscribe({
//         next: (res: ApiResponse<null>) => {
//           console.log(res.message);

//           this.users.splice(index, 1);
//           this.isLoading = false;

//           this.messageService.add({
//             severity: 'success',
//             summary: 'Gatekeeper Deleted',
//             detail: res.message || 'Gatekeeper deleted successfully',
//           });
//         },

//         error: (err) => {
//           console.error("Failed to delete Gatekeeper", err);
//           this.isLoading = false;
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Delete Failed',
//             detail: 'Failed to delete gatekeeper',
//           });
//         }
//       });

//     this.destroyRef.onDestroy(() => subscription.unsubscribe());
//   }

//   goBack(): void {
//     this.isLoading = true;
//     setTimeout(() => {
//       this.isLoading = false;
//       this.router.navigate(['/admin-dashboard']);
//     }, 1000);
//   }

//   resetGatekeeperForm(): GatekeeperCreate {
//     return {
//       username: '',
//       email: '',
//       password: '',
//       address: ''
//     };
//   }
// }


import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { GatekepeperService } from '../../shared/services/gatekeeper.service';
import { Loader } from '../../shared/components/loader/loader';
import { constString } from '../../shared/constants/constStr';
import { GatekeeperCreate, Gatekeeper } from '../../shared/models/gatekeeper.model';
import { ApiResponse } from '../../shared/models/api.response.model';

@Component({
  selector: 'app-gatekeeper',
  imports: [FormsModule, NgIf, NgFor, CommonModule, Loader, ToastModule],
  templateUrl: './gatekeeper.component.html',
  styleUrl: './gatekeeper.component.css'
})
export class GatekeeperComponent implements OnInit {

  constString = constString;
  showAddGatekeeperModal = false;
  isLoading = false;

  private gatekeeperservice = inject(GatekepeperService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  newGatekeeper: GatekeeperCreate = {
    username: '',
    email: '',
    password: '',
    address: ''
  };

  users: Gatekeeper[] = [];

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.showList();
  }


  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  get paginatedUsers(): Gatekeeper[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
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


  openAddGatekeeperModal() {
    this.newGatekeeper = this.resetGatekeeperForm();
    this.showAddGatekeeperModal = true;
  }

  closeAddGatekeeperModal() {
    this.showAddGatekeeperModal = false;
  }

  submitGatekeeperForm() {
    this.isLoading = true;

    const subscription = this.gatekeeperservice
      .addGatekeeper(this.newGatekeeper)
      .subscribe({
        next: () => {
          this.showAddGatekeeperModal = false;
          this.showList();
          this.isLoading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Gatekeeper Added',
            detail: 'Gatekeeper added successfully',
          });
        },
        error: () => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add gatekeeper',
          });
        }
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  showList() {
    this.isLoading = true;

    this.gatekeeperservice.listsGatekeeper().subscribe({
      next: (resp: ApiResponse<Gatekeeper[]>) => {
        const arr = Array.isArray(resp?.data) ? resp.data : [];

        this.users = arr.map(g => ({
          id: g.id,
          username: g.username,
          email: g.email,
          address: g.address,
          role: g.role ?? null,
        }));

        this.currentPage = 1; 
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load Gatekeepers',
        });
      }
    });
  }

  deleteGatekeeper(index: number) {
    const realIndex = (this.currentPage - 1) * this.pageSize + index;
    const userId = this.users[realIndex].id;

    this.isLoading = true;

    const subscription = this.gatekeeperservice
      .deletegatekeeper(userId)
      .subscribe({
        next: () => {
          this.users.splice(realIndex, 1);
          this.isLoading = false;

          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Gatekeeper Deleted',
            detail: 'Gatekeeper deleted successfully',
          });
        },
        error: () => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Delete Failed',
            detail: 'Failed to delete gatekeeper',
          });
        }
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }

  resetGatekeeperForm(): GatekeeperCreate {
    return { username: '', email: '', password: '', address: '' };
  }
}
