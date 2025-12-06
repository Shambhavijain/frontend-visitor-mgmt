import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { gatekeeper, GatekeeperApiResponse } from "../models/model";
import { BASE_URL } from "../constants/baseUrl";
@Injectable({
    providedIn: 'root'
})
export class GatekepeperService {
    private httpClient = inject(HttpClient)
    addGatekeeper(gatekeeperData: gatekeeper): Observable<gatekeeper> {
        return this.httpClient
            .post<gatekeeper>(`${BASE_URL}/api/create_gatekeeper`, gatekeeperData);
    }

    listsGatekeeper(): Observable<GatekeeperApiResponse> {
        return this.httpClient
            .get<GatekeeperApiResponse>(`${BASE_URL}/api/gatekeepers`);
    }

    deletegatekeeper(userId: string): Observable<any> {
  return this.httpClient.delete(`${BASE_URL}/api/gatekeepers/${userId}`);
}

}