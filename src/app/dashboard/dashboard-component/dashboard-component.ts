import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../shared/services/dashboard.service';
import { VisitorService } from '../../shared/services/visitor.service';
import { constString } from '../../shared/constants/constStr';
import { Loader } from '../../shared/components/loader/loader';
import { usercount, visitor } from '../../shared/models/model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, RouterModule, Loader, ToastModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  constString = constString;
  userIconPath = '/icon.png';
  visitorIconPath = '/manage_visitors.png';
  gatekeeperIconPath = '/manage_gatekeeper.png';
  role: string = '';
  visitors: visitor[] = [];
  lastFiveVisitors: visitor[] = [];
  showVisitorOptions = false;
  showGateKeeperOptions = false;
  private messageService = inject(MessageService);
  public visitorService = inject(VisitorService);
  constructor(public dashboardService: DashboardService) {}
  isLoading: boolean = true;
 ngOnInit(): void {
  this.role = localStorage.getItem('userRole') ?? '';

  const userTower = localStorage.getItem('tower') ?? '';
  const userFlat = localStorage.getItem('flatNumber') ?? '';

  this.loadInitialCounts();

  this.visitorService.getAllVisitors().subscribe({
    next: (data: visitor[] | null) => {
      const safeData = Array.isArray(data) ? data : [];

      // Store visitors globally in signal
      this.visitorService.getVisitors.set(safeData);

      let filteredVisitors = safeData;

      
      if (this.isOwnerOrTenant) {
        filteredVisitors = safeData.filter(v =>
          v.tower?.toLowerCase() === userTower.toLowerCase() &&
          String(v.flat_no).toLowerCase() === userFlat.toLowerCase()
        );
      }


      this.visitors = filteredVisitors
        .map(v => ({
          ...v,
          created_at: v.created_at
            ? new Date(Number(v.created_at) * 1000).toLocaleString()
            : 'N/A',
        }))
        .sort((a, b) =>
          new Date(b.created_at!).getTime() -
          new Date(a.created_at!).getTime()
        );

      
      this.lastFiveVisitors = this.visitors.slice(0, 5);

      this.isLoading = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Visitors Loaded',
        detail: 'Recent Visitors data loaded successfully.',
        life: 2000,
      });
    },

    error: (err) => {
      console.error('Failed to fetch visitors:', err);
      this.visitors = [];
      this.lastFiveVisitors = [];
      this.isLoading = false;

      this.messageService.add({
        severity: 'error',
        summary: 'Error Loading Visitors',
        detail: err.message || 'Unable to load visitor data.',
        life: 2000,
      });
    },
  });
}

  loadInitialCounts(): void {
    this.dashboardService.getVisitorCount().subscribe({
      next: (res: any) => {
        this.dashboardService.visitorCount.set(res.data.count);
      },
    });

    this.dashboardService.getUsersCount().subscribe({
      next: (res: usercount) => {
        this.dashboardService.gatekeeperCount.set(res.gatekeeper);
        this.dashboardService.userCount.set(res.owner);
      },
      error: (err) => {
        console.error('Failed to fetch users count:', err);
      },
    });
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }
  get isGatekeeper(): boolean {
    return this.role === 'gatekeeper';
  }

  get isOwnerOrTenant(): boolean {
    return this.role === 'owner' || this.role === 'tenant';
  }

  activeSection: string | null = null;
}
