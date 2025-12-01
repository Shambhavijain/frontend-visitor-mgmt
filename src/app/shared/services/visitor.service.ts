import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';
import { BASE_URL } from '../constants/baseUrl';
import { Observable } from 'rxjs';
import { visitor } from '../models/model';
@Injectable({ providedIn: 'root' })
export class VisitorService {
  private httpClient = inject(HttpClient)
  private visitors = signal<visitor[]>([]);
  tower = localStorage.getItem('tower')
  flatNo = localStorage.getItem('flatNumber')
  role = localStorage.getItem('userRole');

  approvedcount = computed(() =>
    this.visitors()
      ?.filter(v =>
        v.status === 'approved' &&
        (this.role === 'owner' ? (v.tower === this.tower && v.flat_no === this.flatNo) : true)
      ).length || 0
  );
  declinedcount = computed(() => this.visitors()
    ?.filter(v =>
      v.status === 'declined' &&
      (this.role === 'owner' ? (v.tower === this.tower && v.flat_no === this.flatNo) : true)
    ).length || 0
  );

  pendingcount = computed(() => this.visitors()
    ?.filter(v =>
      v.status === 'pending' &&
      (this.role === 'owner' ? (v.tower === this.tower && v.flat_no === this.flatNo) : true)
    ).length || 0
  );

  visitorsTodayCount = computed(() =>
  this.visitors()?.filter(v => {
     if (!v.created_at) return false;

    const visitDate = new Date(v.created_at);
    const today = new Date();

    return (
      visitDate.getDate() === today.getDate() &&
      visitDate.getMonth() === today.getMonth() &&
      visitDate.getFullYear() === today.getFullYear()
    );
  }).length || 0
);

  getVisitors = this.visitors;

  addVisitor(visitor: any): Observable<any> {
    return this.httpClient.post(`${BASE_URL}/create-visitor`, visitor);
  }

  getAllVisitors(): Observable<any> {
    return this.httpClient.get(`${BASE_URL}/getvisitors`);
  }

  updateVisitorStatus(email: string, status: string): Observable<any> {
    const payload = {
      email: email,
      status: status
    }
    return this.httpClient.patch(`${BASE_URL}/update-visitor-status`, payload)
  }
}