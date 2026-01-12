import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


import { BASE_URL } from "../constants/baseUrl";
import { User } from "../models/user.model";
import { ApiResponse } from "../models/api.response.model";
@Injectable({
  providedIn: 'root'

})
export class UserService {
  constructor(private httpClient: HttpClient) { }


  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }

  listUsers(): Observable<ApiResponse<User[]>> {
    return this.httpClient.get<ApiResponse<User[]>>(`${BASE_URL}/users/`);
  }

  deleteUser(userId: string): Observable<ApiResponse<null>> {
  return this.httpClient.delete<ApiResponse<null>>(`${BASE_URL}/users/${userId}`);
}

  getCurrentUser(): Observable<ApiResponse<User>> {
    const userId = localStorage.getItem('userId');
    return this.httpClient.get<ApiResponse<User>> (`${BASE_URL}/users/${userId}`).pipe(
    );
  }

  // updateUser(data: { email: string, username: string }): Observable<any> {
  //   const userId = localStorage.getItem('userId')
  //   return this.httpClient.patch(`${BASE_URL}/update-user/${userId}`, data)
  // }
}