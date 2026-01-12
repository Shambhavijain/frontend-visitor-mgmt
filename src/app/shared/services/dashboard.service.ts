import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";

import { BASE_URL } from "../constants/baseUrl";
import { ApiResponse } from "../models/api.response.model";
import { UserCount } from "../models/user.model";
import { VisitorCount } from "../models/visitor.model";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  visitorCount = signal<number>(0);
  gatekeeperCount = signal<number>(0);
  userCount = signal<number>(0);

  constructor(private httpClient: HttpClient) { }

  getVisitorCount(): Observable<ApiResponse<VisitorCount>> {
    return this.httpClient.get<ApiResponse<VisitorCount>>(`${BASE_URL}/visitor/count`);
  }
  getUsersCount():Observable<ApiResponse<UserCount>>{
    return this.httpClient.get<ApiResponse<UserCount>>(`${BASE_URL}/users/count`);
  }

}