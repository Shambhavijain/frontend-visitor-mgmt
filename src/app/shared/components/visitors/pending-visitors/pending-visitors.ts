// import { Component, computed, inject } from '@angular/core';
// import { CommonModule, NgFor } from '@angular/common';
// import { VisitorService } from '../../../services/visitor.service';
// import { constString } from '../../../constants/constStr';
// import { ApiResponse } from '../../../models/api.response.model';
// import { Visitor } from '../../../models/visitor.model';
// import { VisitorStatus } from '../../../enum/enum';
// @Component({
//   selector: 'app-pending-visitors',
//   imports: [NgFor, CommonModule],
//   templateUrl: './pending-visitors.html',
//   styleUrl: './pending-visitors.css'
// })
// export class PendingVisitors {
//   constString = constString;

//   private visitorService = inject(VisitorService);


//   visitorsSignal = this.visitorService.getVisitors;
//   pageSize = 5;
//   currentPage = 1;
//   userRole = localStorage.getItem('userRole');
//   tower = localStorage.getItem('tower');
//   flatNo = localStorage.getItem('flatNumber');
//   pendingVisitors = computed<Visitor[]>(() => {
//     const visitors = this.visitorService.getVisitors() ?? [];

//     if (this.userRole === 'owner') {
//       return visitors.filter(v =>
//         v.status === VisitorStatus.PENDING &&
//         v.tower === this.tower &&
//         String(v.flat_no) === String(this.flatNo)
//       );
//     }

//     return visitors.filter(v => v.status === VisitorStatus.PENDING);
//   });

//   // get pendingVisitors(): Visitor[] {
//   //   const visitors: Visitor[] = this.visitorsSignal() ?? [];

//   //   if (this.userRole === 'owner') {
//   //     return visitors.filter(v =>
//   //       v.status === VisitorStatus.PENDING &&
//   //       v.tower === this.tower &&
//   //       String(v.flat_no) === String(this.flatNo)
//   //     );
//   //   }

//   //   return visitors.filter(v => v.status === VisitorStatus.PENDING);
//   // }

//   canModify(): boolean {
//     return this.userRole === 'owner';
//   }

//   approve(visitor: Visitor): void {
//     this.visitorService
//       .updateVisitorStatus({
//         visitor_id: visitor.id,
//         status: VisitorStatus.APPROVED,
//       })
//       .subscribe({
//         next: () => this.refreshVisitors(),
//         error: (err) => console.error('Error approving visitor:', err),
//       });
//   }

//   decline(visitor: Visitor): void {
//     this.visitorService
//       .updateVisitorStatus({
//         visitor_id: visitor.id,
//         status: VisitorStatus.DECLINED,
//       })
//       .subscribe({
//         next: () => this.refreshVisitors(),
//         error: (err) => console.error('Error declining visitor:', err),
//       });
//   }

//   refreshVisitors(): void {
//     this.visitorService.getAllVisitors().subscribe({
//       next: (visitors: ApiResponse<Visitor[]>) => {
//         this.visitorService.getVisitors.set(visitors.data);
//       },
//       error: (err) => {
//         console.error('Failed to refresh visitors:', err);
//       },
//     });
//   }
//   get totalPages(): number {
//     return Math.ceil(this.pendingVisitors.length / this.pageSize);
//   }

//   get  paginatedVisitors() {
//     const start = (this.currentPage - 1) * this.pageSize;
//     return this.pendingVisitors.slice(start, start + this.pageSize);
//   }

//   changePage(page: number) {
//     this.currentPage = page;
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }
// }


import { Component, inject, computed } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { VisitorService } from '../../../services/visitor.service';
import { constString } from '../../../constants/constStr';
import { ApiResponse } from '../../../models/api.response.model';
import { Visitor } from '../../../models/visitor.model';
import { VisitorStatus } from '../../../enum/enum';

@Component({
  selector: 'app-pending-visitors',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './pending-visitors.html',
  styleUrl: './pending-visitors.css'
})
export class PendingVisitors {
  constString = constString;
  private visitorService = inject(VisitorService);

  pageSize = 5;
  currentPage = 1;

  userRole = localStorage.getItem('userRole');
  tower = localStorage.getItem('tower');
  flatNo = localStorage.getItem('flatNumber');

  pendingVisitors = computed<Visitor[]>(() => {
    const visitors = this.visitorService.getVisitors() ?? [];

    return visitors.filter(v => {
      const status = v.status?.toString().toUpperCase();

      if (status !== VisitorStatus.PENDING) return false;

      if (this.userRole === 'owner') {
        return (
          v.tower?.trim().toUpperCase() === this.tower?.trim().toUpperCase() &&
          String(v.flat_no).trim() === String(this.flatNo).trim()
        );
      }

      return true;
    });
  });

  totalPages = computed(() =>
    Math.ceil(this.pendingVisitors().length / this.pageSize)
  );

  paginatedVisitors = computed(() => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.pendingVisitors().slice(start, start + this.pageSize);
  });

  canModify(): boolean {
    return this.userRole === 'owner';
  }

  approve(visitor: Visitor): void {
    this.visitorService.updateVisitorStatus({
      visitor_id: visitor.id,
      status: VisitorStatus.APPROVED,
    }).subscribe({
      next: () => this.refreshVisitors(),
      error: err => console.error('Error approving visitor:', err),
    });
  }

  decline(visitor: Visitor): void {
    this.visitorService.updateVisitorStatus({
      visitor_id: visitor.id,
      status: VisitorStatus.DECLINED,
    }).subscribe({
      next: () => this.refreshVisitors(),
      error: err => console.error('Error declining visitor:', err),
    });
  }

  refreshVisitors(): void {
    this.visitorService.getAllVisitors().subscribe({
      next: (res: ApiResponse<Visitor[]>) =>
        this.visitorService.getVisitors.set(res.data),
      error: err => console.error('Failed to refresh visitors:', err),
    });
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
