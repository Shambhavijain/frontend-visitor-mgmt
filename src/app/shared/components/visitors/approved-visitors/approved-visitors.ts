// import { Component, inject } from '@angular/core';
// import { VisitorService } from '../../../services/visitor.service';
// import { CommonModule, NgFor } from '@angular/common';
// import { constString } from '../../../constants/constStr';

// @Component({
//   selector: 'app-approved-visitors',
//   imports: [NgFor, CommonModule],
//   templateUrl: './approved-visitors.html',
//   styleUrl: './approved-visitors.css',
// })
// export class ApprovedVisitors {
//   constString = constString;
//   private visitorService = inject(VisitorService);

//   userId = localStorage.getItem('userId');
//   userRole = localStorage.getItem('userRole');

//   visitors = this.visitorService.getVisitors;

//   tower = localStorage.getItem('tower');
//   flatNo = localStorage.getItem('flatNumber');

//   get approvedVisitors() {
//   const visitors = this.visitorService.getVisitors() || [];

//   if (this.userRole === 'owner') {
//     return visitors.filter(v =>
//       v.status === 'approved' &&
//       v.tower === this.tower &&
//       v.flat_no === this.flatNo
//     );
//   }

//   // Admin / gatekeeper — show all approved visitors
//   return visitors.filter(v => v.status === 'approved');
// }

// }


import { Component, inject } from '@angular/core';
import { VisitorService } from '../../../services/visitor.service';
import { CommonModule, NgFor } from '@angular/common';
import { constString } from '../../../constants/constStr';
import { visitor } from '../../../models/model';

@Component({
  selector: 'app-approved-visitors',
  imports: [NgFor, CommonModule],
  templateUrl: './approved-visitors.html',
  styleUrl: './approved-visitors.css',
})
export class ApprovedVisitors {
  constString = constString;
  private visitorService = inject(VisitorService);
  pageSize = 5;
  currentPage = 1;

  
  userId = localStorage.getItem('userId');
  userRole = localStorage.getItem('userRole');

  tower = localStorage.getItem('tower');
  flatNo = localStorage.getItem('flatNumber');

  visitors = this.visitorService.getVisitors;

  get approvedVisitors(): visitor[] {
    const raw = this.visitorService.getVisitors();
    const visitors: visitor[] = Array.isArray(raw) ? raw : [];

    if (this.userRole === 'owner') {
      return visitors.filter((v: visitor) =>
        v.status === 'approved' &&
        v.tower === this.tower &&
        String(v.flat_no) === String(this.flatNo)
      );
    }

    return visitors.filter((v: visitor) => v.status === 'approved');
  }
  get totalPages(): number {
    return Math.ceil(this.approvedVisitors.length / this.pageSize);
  }

  get paginatedVisitors() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.approvedVisitors.slice(start, start + this.pageSize);
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
