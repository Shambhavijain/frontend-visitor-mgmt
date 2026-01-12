import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../constants/baseUrl";
import { GatekeeperCreate, Gatekeeper } from "../models/gatekeeper.model";
import { ApiResponse } from "../models/api.response.model";
@Injectable({
    providedIn: 'root'
})
export class GatekepeperService {
    private httpClient = inject(HttpClient)
    addGatekeeper(gatekeeperData: GatekeeperCreate): Observable<ApiResponse<Gatekeeper>>{
        return this.httpClient
            .post<ApiResponse<Gatekeeper>> (`${BASE_URL}/gatekeeper/create`, gatekeeperData);
    }

    listsGatekeeper(): Observable<ApiResponse<Gatekeeper[]>> {
        return this.httpClient
            .get<ApiResponse<Gatekeeper[]>>(`${BASE_URL}/gatekeeper/`);
    }

    deletegatekeeper(userId: string): Observable<ApiResponse<null>> {
  return this.httpClient.delete<ApiResponse<null>>(`${BASE_URL}/gatekeeper/${userId}`);
}

}