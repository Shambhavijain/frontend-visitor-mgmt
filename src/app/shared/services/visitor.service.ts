import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

import { BASE_URL } from '../constants/baseUrl';
import { ApiResponse } from '../models/api.response.model';
import { VisitorStatus } from '../enum/enum';
import { Visitor, CreateVisitorRequest, UpdateVisitorRequest } from '../models/visitor.model';

@Injectable({ providedIn: 'root' })

export class VisitorService {
  private httpClient = inject(HttpClient)
  private visitors = signal<Visitor[]>([]);


  get role() {
    return localStorage.getItem('userRole');
  }



  approvedcount = computed(() =>
    this.visitors().filter(v => v.status === VisitorStatus.APPROVED).length
  );

  declinedcount = computed(() =>
    this.visitors().filter(v => v.status === VisitorStatus.DECLINED).length
  );

  pendingcount = computed(() =>
    this.visitors().filter(v => v.status === VisitorStatus.PENDING).length
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

  addVisitor(visitor: CreateVisitorRequest): Observable<ApiResponse<Visitor>> {
    return this.httpClient.post<ApiResponse<Visitor>>(`${BASE_URL}/visitor/create`, visitor);
  }

  getAllVisitors(): Observable<ApiResponse<Visitor[]>> {
    return this.httpClient.get<ApiResponse<Visitor[]>>(`${BASE_URL}/visitor/`)
  }


  updateVisitorStatus(payload: UpdateVisitorRequest): Observable<any> {
    const apiPayload = {
      ...payload,
      status: payload.status.toLowerCase(), // 🔥 ADAPT HERE
    };

    return this.httpClient.patch(`${BASE_URL}/visitor/status`, apiPayload);
  }



}