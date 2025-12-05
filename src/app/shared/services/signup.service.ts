import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { requestUser } from "../models/model";
import { BASE_URL } from "../constants/baseUrl";

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private httpClient = inject(HttpClient)

  signup(userData: requestUser): Observable<any> {
    return this.httpClient.post(`${BASE_URL}/api/auth/signup`, userData);
  }

}