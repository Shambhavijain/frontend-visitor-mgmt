import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GatekepeperService } from './gatekeeper.service';
import { BASE_URL } from '../constants/baseUrl';
import { ApiResponse } from '../models/api.response.model';
import { Gatekeeper } from '../models/gatekeeper.model';

describe('GatekepeperService', () => {
  let service: GatekepeperService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GatekepeperService]
    });

    service = TestBed.inject(GatekepeperService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add gatekeeper', () => {

    const mockResponse: ApiResponse<Gatekeeper> = {
      status: 'success',
      data: {} as Gatekeeper,
      message: ''
    };

    service.addGatekeeper({} as any).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/gatekeeper/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should list gatekeepers', () => {

    const mockResponse: ApiResponse<Gatekeeper[]> = {
      status: 'success',
      data: [],
      message: ''
    };

    service.listsGatekeeper().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/gatekeeper/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should delete gatekeeper', () => {

    const mockResponse: ApiResponse<null> = {
      status: 'success',
      data: null,
      message: ''
    };

    service.deletegatekeeper('1').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/gatekeeper/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

});
