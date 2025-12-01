import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../constants/baseUrl";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  visitorCount = signal<number>(0);
  gatekeeperCount = signal<number>(0);
  userCount = signal<number>(0);

  constructor(private httpClient: HttpClient) { }

  getVisitorCount(): Observable<number> {
    return this.httpClient.get<number>(`${BASE_URL}/getvisitorscount`);
  }
  getGatekeeperCount(): Observable<number> {
    return this.httpClient.get<number>(`${BASE_URL}/getgatekeepercount`);
  }
  getOwnerCount(): Observable<number> {
    return this.httpClient.get<number>(`${BASE_URL}/getownercount`);
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