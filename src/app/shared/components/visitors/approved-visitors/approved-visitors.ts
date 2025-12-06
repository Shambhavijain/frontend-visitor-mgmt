import { Component, inject } from '@angular/core';
import { VisitorService } from '../../../services/visitor.service';
import { CommonModule, NgFor } from '@angular/common';
import { constString } from '../../../constants/constStr';

@Component({
  selector: 'app-approved-visitors',
  imports: [NgFor, CommonModule],
  templateUrl: './approved-visitors.html',
  styleUrl: './approved-visitors.css',
})
export class ApprovedVisitors {
  constString = constString;
  private visitorService = inject(VisitorService);

  userId = localStorage.getItem('userId');
  userRole = localStorage.getItem('userRole');

  visitors = this.visitorService.getVisitors;

  tower = localStorage.getItem('tower');
  flatNo = localStorage.getItem('flatNumber');

  get approvedVisitors() {
  const visitors = this.visitorService.getVisitors() || [];

  if (this.userRole === 'owner') {
    return visitors.filter(v =>
      v.status === 'approved' &&
      v.tower === this.tower &&
      v.flat_no === this.flatNo
    );
  }

  // Admin / gatekeeper — show all approved visitors
  return visitors.filter(v => v.status === 'approved');
}

}
