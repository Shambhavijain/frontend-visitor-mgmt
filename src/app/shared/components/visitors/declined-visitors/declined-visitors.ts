import { Component, inject } from '@angular/core';
import { VisitorService } from '../../../services/visitor.service';
import { CommonModule, NgFor } from '@angular/common';
import { constString } from '../../../constants/constStr';

@Component({
  selector: 'app-declined-visitors',
  imports: [NgFor, CommonModule],
  templateUrl: './declined-visitors.html',
  styleUrl: './declined-visitors.css'
})
export class DeclinedVisitors {
  constString=constString
  private visitorService = inject(VisitorService)
  visitors = this.visitorService.getVisitors;
 

  userId = localStorage.getItem('userId');
  userRole = localStorage.getItem('userRole');
  tower = localStorage.getItem('tower');
  flatNo = localStorage.getItem('flatNumber');
 
 get declinedVisitors() {
  const visitors = this.visitorService.getVisitors() || [];
  if (this.userRole === 'owner') {
    return visitors.filter(v =>
      v.status === 'declined' &&
      v.tower === this.tower &&
      v.flat_no === this.flatNo
    );
  }
   return visitors.filter(v => v.status === 'declined');
  }


 

}
