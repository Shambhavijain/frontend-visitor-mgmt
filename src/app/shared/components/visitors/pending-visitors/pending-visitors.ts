import { Component, inject, effect, OnInit } from '@angular/core';
import { VisitorService } from '../../../services/visitor.service';
import { CommonModule, NgFor } from '@angular/common';
import { constString } from '../../../constants/constStr';

@Component({
  selector: 'app-pending-visitors',
  imports: [NgFor, CommonModule],
  templateUrl: './pending-visitors.html',
  styleUrl: './pending-visitors.css'
})
export class PendingVisitors {
  constString=constString
  private visitorService = inject(VisitorService)
  visitors = this.visitorService.getVisitors;
  userRole = localStorage.getItem('userRole');
  userId = localStorage.getItem('userId');
  tower = localStorage.getItem('tower');
  flatNo = localStorage.getItem('flatNumber');
  
  get pendingVisitors() {
    return this.visitorService.getVisitors().filter(v => v.status === 'pending');
  }

  canModify(): boolean {
    return this.userRole === 'owner';
  }

  approve(visitor: any) {
  this.visitorService.updateVisitorStatus(visitor.email, 'approved').subscribe({
    next: () => {
      console.log('Visitor approved');
      this.refreshVisitors(); // optional: refresh list
    },
    error: (err) => {
      console.error('Error approving visitor:', err);
    }
  });
}

decline(visitor: any) {
  this.visitorService.updateVisitorStatus(visitor.email, 'declined').subscribe({
    next: () => {
      console.log('Visitor declined');
      this.refreshVisitors(); // optional: refresh list
    },
    error: (err) => {
      console.error('Error declining visitor:', err);
    }
  });
}

refreshVisitors() {
  this.visitorService.getAllVisitors().subscribe({
    next: (data) => this.visitorService.getVisitors.set(data),
    error: (err) => console.error('Failed to refresh visitors:', err)
  });
}

}
