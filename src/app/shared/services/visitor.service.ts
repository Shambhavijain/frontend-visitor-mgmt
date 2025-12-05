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

  addVisitor(visitor: any): Observable<visitor> {
    return this.httpClient.post<visitor>(`${BASE_URL}/api/create_visitor`, visitor);
  }

  getAllVisitors(): Observable<any> {
    return this.httpClient.get(`${BASE_URL}/api/visitors`);
  }

  updateVisitorStatus(id: string, status: string): Observable<any> {
    const payload = {
      visitor_id: id,
      status: status
    }
    return this.httpClient.patch(`${BASE_URL}/api/update_visitor_status`, payload)
  }
}