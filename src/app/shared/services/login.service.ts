import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../constants/baseUrl";
import { LoginRequest } from "../models/model";
@Injectable({
   providedIn: 'root'

})
export class LoginService {
   constructor(private httpClient: HttpClient) { }

   login(credentials: LoginRequest): Observable<any> {

      return this.httpClient
         .post(`${BASE_URL}/api/auth/login`, credentials,
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
         );
   }


}