import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../constants/baseUrl";
import { user, usercount } from "../models/model";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  visitorCount = signal<number>(0);
  gatekeeperCount = signal<number>(0);
  userCount = signal<number>(0);

  constructor(private httpClient: HttpClient) { }

  getVisitorCount(): Observable<number> {
    return this.httpClient.get<number>(`${BASE_URL}/api/visitors/count`);
  }
  getUsersCount():Observable<usercount>{
    return this.httpClient.get<usercount>(`${BASE_URL}/api/users/owners/count`);
  }




  // incrementVisitor(): void {
  //   this.visitorCount.update(count => count + 1);
  // }

  // decrementVisitor(): void {
  //   this.visitorCount.update(count => count - 1);
  // }


  // incrementGatekeeper(): void {
  //   this.visitorCount.update(count => count + 1);
  // }

  // decrementGatekeeper(): void {
  //   this.visitorCount.update(count => count - 1);
  // }
  // incrementOwner(): void {
  //   this.visitorCount.update(count => count + 1);
  // }

  // decrementOwner() {
  //   this.visitorCount.update(count => count - 1);
  // }

}