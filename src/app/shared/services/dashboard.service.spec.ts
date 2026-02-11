import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { BASE_URL } from '../constants/baseUrl';
import { UserCount } from '../models/user.model';
import { VisitorCount } from '../models/visitor.model';
import { ApiResponse } from '../models/api.response.model';

describe('DashboardService', () => {
    let service: DashboardService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DashboardService]
        });

        service = TestBed.inject(DashboardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });



    it('should fetch visitor count', () => {

        const mockResponse: ApiResponse<VisitorCount> = {
            status: 'success',
            data: { count: 10 },
            message: ''
        };

        service.getVisitorCount().subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${BASE_URL}/visitor/count`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });



    it('should fetch user count', () => {

        const mockResponse: ApiResponse<UserCount> = {
            status: 'success',
            data: { Owner: 5, Gatekeeper: 2 },
            message: ''
        };

        service.getUsersCount().subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${BASE_URL}/users/count`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

});
