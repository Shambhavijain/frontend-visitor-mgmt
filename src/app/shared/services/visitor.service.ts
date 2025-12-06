import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';
import { BASE_URL } from '../constants/baseUrl';
import { Observable } from 'rxjs';
import { visitor } from '../models/model';
@Injectable({ providedIn: 'root' })
export class VisitorService {
  private httpClient = inject(HttpClient)
  private visitors = signal<visitor[]>([]);
  get tower() {
    return localStorage.getItem('tower');
  }

  get flatNo() {
    return localStorage.getItem('flatNumber');
  }

  get role() {
    return localStorage.getItem('userRole');
  }

  approvedcount = computed(() =>
    this.visitors().filter(v =>
      v.status === 'approved' &&
      (this.role === 'owner'
        ? v.tower === this.tower && v.flat_no === this.flatNo
        : true)
    ).length
  );

  declinedcount = computed(() =>
    this.visitors().filter(v =>
      v.status === 'declined' &&
      (this.role === 'owner'
        ? v.tower === this.tower && v.flat_no === this.flatNo
        : true)
    ).length
  );

  pendingcount = computed(() =>
    this.visitors().filter(v =>
      v.status === 'pending' &&
      (this.role === 'owner'
        ? v.tower === this.tower && v.flat_no === this.flatNo
        : true)
    ).length
  );

  visitorsTodayCount = computed(() =>
    this.visitors()?.filter(v => {
      if (!v.created_at) return false;
      console.log(v.created_at)

      const visitDate = new Date(Number(v.created_at) * 1000);
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
    return this.httpClient.post<any>(`${BASE_URL}/api/create_visitor`, visitor);
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

filterByOwner(v: visitor): boolean {
  const role = this.role;

  if (role !== 'owner' && role !== 'tenant') return true; // admin/gatekeeper → allow all

  return (
    v.tower === this.tower &&
    v.flat_no === this.flatNo
  );
}

  
}