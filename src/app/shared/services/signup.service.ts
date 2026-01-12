import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { requestUser } from "../models/model";
import { BASE_URL } from "../constants/baseUrl";
import { ApiResponse } from "../models/api.response.model";

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private httpClient = inject(HttpClient)

  signup(userData: requestUser): Observable<ApiResponse<null>> {
    return this.httpClient.post<ApiResponse<null>>(`${BASE_URL}/auth/signup`, userData);
  }

}