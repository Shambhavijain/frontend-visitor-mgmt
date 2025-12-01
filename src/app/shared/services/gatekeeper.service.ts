import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { gatekeeper } from "../models/model";
import { BASE_URL } from "../constants/baseUrl";
@Injectable({
    providedIn: 'root'
})
export class GatekepeperService {
    private httpClient = inject(HttpClient)
    addGatekeeper(gatekeeperData: gatekeeper): Observable<gatekeeper> {
        return this.httpClient
            .post<gatekeeper>(`${BASE_URL}/create-gatekeeper`, gatekeeperData);
    }

    listsGatekeeper(): Observable<gatekeeper[]> {
        return this.httpClient
            .get<gatekeeper[]>(`${BASE_URL}/gatekeepers`);
    }

    deletegatekeeper(name: string): Observable<any> {
        return this.httpClient
            .post(`${BASE_URL}/delete-gatekeeper`, { username: name });
    }
}