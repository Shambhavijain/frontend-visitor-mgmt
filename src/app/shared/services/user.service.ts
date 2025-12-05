import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Pipe } from "@angular/core";
import { tap } from "rxjs";
import { BASE_URL } from "../constants/baseUrl";
@Injectable({
  providedIn: 'root'

})
export class UserService {
  constructor(private httpClient: HttpClient) { }


  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }

  listUsers(): Observable<any> {
    return this.httpClient.get(`${BASE_URL}/api/users`);
  }

  deleteUser(userId: string): Observable<any> {
  return this.httpClient.delete(`${BASE_URL}/api/users/${userId}`);
}

  getCurrentUser(): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.httpClient.get<any>(`${BASE_URL}/api/users/${userId}`).pipe(
      tap(user => {
        localStorage.setItem('tower', user.tower);
        localStorage.setItem('flatNumber', user.flat_no);
      })
    );
  }

  // updateUser(data: { email: string, username: string }): Observable<any> {
  //   const userId = localStorage.getItem('userId')
  //   return this.httpClient.patch(`${BASE_URL}/update-user/${userId}`, data)
  // }
}