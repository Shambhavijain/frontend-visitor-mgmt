import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VisitorService } from './visitor.service';
import { BASE_URL } from '../constants/baseUrl';
import { VisitorStatus } from '../enum/enum';
import { ApiResponse } from '../models/api.response.model';
import { Visitor } from '../models/visitor.model';

describe('VisitorService', () => {
  let service: VisitorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VisitorService]
    });

    service = TestBed.inject(VisitorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should return role from localStorage', () => {
    localStorage.setItem('userRole', 'owner');
    expect(service.role).toBe('owner');
  });

  it('should add visitor', () => {
    const mockVisitor: Visitor = {
      id: '1',
      name: 'Test',
      phone: '123',
      status: VisitorStatus.PENDING,
      created_at: String(Math.floor(Date.now() / 1000))
    } as any;

    const mockResponse: ApiResponse<Visitor> = {
      status: 'success',
      data: mockVisitor,
      message: ''
    };

    service.addVisitor({} as any).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/visitor/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should fetch all visitors', () => {
    const mockVisitors: Visitor[] = [];

    const mockResponse: ApiResponse<Visitor[]> = {
      status: 'success',
      data: mockVisitors,
      message: ''
    };

    service.getAllVisitors().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/visitor/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update visitor status and convert to lowercase', () => {
    service.updateVisitorStatus({ visitor_id: '1', status: 'APPROVED' } as any)
      .subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/visitor/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.status).toBe('approved');
    req.flush({});
  });

  it('should calculate approved, declined and pending counts', () => {
    const visitors: Visitor[] = [
      { status: VisitorStatus.APPROVED } as any,
      { status: VisitorStatus.DECLINED } as any,
      { status: VisitorStatus.PENDING } as any
    ];

    (service as any).visitors.set(visitors);

    expect(service.approvedcount()).toBe(1);
    expect(service.declinedcount()).toBe(1);
    expect(service.pendingcount()).toBe(1);
  });

  it('should calculate visitorsTodayCount correctly', () => {
    const todayTimestamp = Math.floor(Date.now() / 1000);

    const visitors: Visitor[] = [
      { status: VisitorStatus.APPROVED, created_at: String(todayTimestamp) } as any,
      { status: VisitorStatus.APPROVED, created_at: '1000' } as any,
      { status: VisitorStatus.APPROVED } as any
    ];

    (service as any).visitors.set(visitors);

    expect(service.visitorsTodayCount()).toBe(1);
  });
});