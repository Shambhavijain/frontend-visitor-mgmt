import { Component, inject } from '@angular/core';
import { VisitorService } from '../../../services/visitor.service';
import { CommonModule, NgFor } from '@angular/common';
import { constString } from '../../../constants/constStr';
@Component({
  selector: 'app-approved-visitors',
  imports: [NgFor, CommonModule],
  templateUrl: './approved-visitors.html',
  styleUrl: './approved-visitors.css'
})
export class ApprovedVisitors {
  constString=constString
  private visitorService = inject(VisitorService)
 

  userId = localStorage.getItem('userId');
  userRole = localStorage.getItem('userRole');

  visitors = this.visitorService.getVisitors;

  tower = localStorage.getItem('tower');
  flatNo = localStorage.getItem('flatNumber');


 
 get approvedVisitors() {
    return this.visitorService.getVisitors().filter(v => v.status === 'approved')||[];
  }

}
