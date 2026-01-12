import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { DashboardService } from '../../shared/services/dashboard.service';
import { VisitorService } from '../../shared/services/visitor.service';
import { constString } from '../../shared/constants/constStr';
import { Loader } from '../../shared/components/loader/loader';
import { Visitor, VisitorCount } from '../../shared/models/visitor.model';
import { ApiResponse } from '../../shared/models/api.response.model';
import { VisitorStatus } from '../../shared/enum/enum';
import { UserCount } from '../../shared/models/user.model';


@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, RouterModule, Loader, ToastModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constString = constString;
  VisitorStatus = VisitorStatus
  userIconPath = '/icon.png';
  visitorIconPath = '/manage_visitors.png';
  gatekeeperIconPath = '/manage_gatekeeper.png';
  role: string = '';
  visitors: Visitor[] = [];
  lastFiveVisitors: Visitor[] = [];
  showVisitorOptions = false;
  showGateKeeperOptions = false;
  private messageService = inject(MessageService);
  public visitorService = inject(VisitorService);
  constructor(public dashboardService: DashboardService) { }
  isLoading: boolean = true;

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole') ?? '';

    this.loadInitialCounts();

    this.visitorService.getAllVisitors().subscribe({
      next: (res: ApiResponse<Visitor[]>) => {
        const normalizedVisitors = res.data.map(v => ({
          ...v,
          status: v.status?.toUpperCase() as VisitorStatus,
        }));

        this.visitorService.getVisitors.set(normalizedVisitors);


        this.visitors = [...normalizedVisitors]
          .map(v => ({
            ...v,
            status: v.status?.toUpperCase() as VisitorStatus,
            created_at: v.created_at
              ? new Date(Number(v.created_at) * 1000).toLocaleString()
              : 'N/A',
          }))
          .sort(
            (visitor1: Visitor, visitor2: Visitor) =>
              new Date(visitor2.created_at!).getTime() -
              new Date(visitor1.created_at!).getTime()
          );

        this.lastFiveVisitors = this.visitors.slice(0, 5);
        this.isLoading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Visitors Loaded',
          detail: 'Recent visitors loaded successfully',
          life: 2000,
        });
      },

      error: (err) => {
        this.visitors = [];
        this.lastFiveVisitors = [];
        this.isLoading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error Loading Visitors',
          detail: err?.message || 'Unable to load visitor data',
          life: 2000,
        });
      },
    });
  }

  loadInitialCounts(): void {
    this.dashboardService.getVisitorCount().subscribe({
      next: (res: ApiResponse<VisitorCount>) => {
        console.log(res)
        this.dashboardService.visitorCount.set(res.data.count);
      },
    });

    this.dashboardService.getUsersCount().subscribe({
      next: (res: ApiResponse<UserCount>) => {
        this.dashboardService.gatekeeperCount.set(res.data.Gatekeeper);
        this.dashboardService.userCount.set(res.data.Owner);
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