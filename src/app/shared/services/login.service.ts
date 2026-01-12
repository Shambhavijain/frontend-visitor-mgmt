import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { BASE_URL } from "../constants/baseUrl";
import { LoginRequest } from "../models/auth.model";
import { ApiResponse } from "../models/api.response.model";


@Injectable({
   providedIn: 'root'

})
export class LoginService {
   constructor(private httpClient: HttpClient) { }

   login(credentials: LoginRequest): Observable<ApiResponse<any>> {

      return this.httpClient
         .post<ApiResponse<any>>(`${BASE_URL}/auth/login`, credentials,
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
         );
   }


}