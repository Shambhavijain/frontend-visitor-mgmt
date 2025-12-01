import { Component, inject, OnInit } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitorService } from '../../services/visitor.service';
import { ApprovedVisitors } from './approved-visitors/approved-visitors';
import { DeclinedVisitors } from './declined-visitors/declined-visitors';
import { PendingVisitors } from './pending-visitors/pending-visitors';
import { constString } from '../../constants/constStr';
import { visitor } from '../../models/model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

declare var bootstrap: any;
@Component({
  selector: 'app-visitors',
  imports: [FormsModule, NgIf, CommonModule, ApprovedVisitors, DeclinedVisitors, PendingVisitors, ToastModule],
  templateUrl: './visitors.html',
  styleUrl: './visitors.css'
})

export class Visitors implements OnInit {

  constString = constString
  private visitorService = inject(VisitorService)
  visitors = this.visitorService.getVisitors
  activeTab: string = 'approved';
  showAddVisitorModal: boolean = false;
  showSuccessMessage: boolean = false;
  private router = inject(Router)
  private messageService = inject(MessageService);


  newVisitor: visitor = {
    name: '',
    email: '',
    tower: '',
    flat_no: '',
    status: 'pending'
  };


  isLoading = true;
  ngOnInit(): void {
    this.visitorService.getAllVisitors().subscribe({
      next: (data) => {
        this.visitorService.getVisitors.set(data);
        this.isLoading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Visitors Loaded',
          detail: 'Visitor data loaded successfully.',
          life: 3000
        });

      },
      error: (err) => {
        console.error('Failed to fetch visitors:', err);
        this.isLoading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error Loading Visitors',
          detail: err.message || 'Unable to load visitor data.',
          life: 3000
        });

      }
    });
  }


  navigateByRole(): void {
    const role = localStorage.getItem('userRole')
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin-dashboard'])
        break
      case 'owner':
        this.router.navigate(['/owner-dashboard'])
        break
      case 'gatekeeper':
        this.router.navigate(['/gatekeeper-dashboard'])

    }
  }
  openAddVisitorModal(): void {
    this.showAddVisitorModal = true;
  }

  closeAddVisitorModal(): void {
    this.showAddVisitorModal = false;
  }

  submitVisitorForm(userForm: NgForm): void {
    this.isLoading = true;
    this.visitorService.addVisitor(this.newVisitor).subscribe({
      next: () => {
        const modalElement = document.getElementById('addVisitorModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        this.messageService.add({
          severity: 'success',
          summary: 'Visitor Added',
          detail: 'Visitor request submitted successfully.',
          life: 3000
        });
        userForm.resetForm();

        this.visitorService.getAllVisitors().subscribe({
          next: (data) => this.visitorService.getVisitors.set(data),
          error: (err) => console.error('Failed to refresh visitors:', err)
        });
        this.isLoading = false;
      },
      error: (err) => {

        this.isLoading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Failed to add visitor. Please try again.',
          life: 3000
        });
      }
    });
  }

  goBackByRole(): void {
    this.navigateByRole();
  }

}