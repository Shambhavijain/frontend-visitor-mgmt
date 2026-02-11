import { TestBed } from '@angular/core/testing';
import { DeclinedVisitors } from './declined-visitors';
import { VisitorService } from '../../../services/visitor.service';
import { signal } from '@angular/core';

describe('DeclinedVisitors', () => {
  let component: DeclinedVisitors;
  let service: any;

  const mockVisitors = [
    { status: 'declined', tower: 'A', flat_no: '101' },
    { status: 'declined', tower: 'A', flat_no: 101 },
    { status: 'declined', tower: 'B', flat_no: '202' },
    { status: 'approved', tower: 'A', flat_no: '101' }
  ];

  beforeEach(() => {
    service = {
      getVisitors: signal(mockVisitors)
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      switch (key) {
        case 'userRole': return 'admin';
        case 'tower': return 'A';
        case 'flatNumber': return '101';
        default: return null;
      }
    });

    TestBed.configureTestingModule({
      imports: [DeclinedVisitors],
      providers: [{ provide: VisitorService, useValue: service }]
    });

    component = TestBed.createComponent(DeclinedVisitors).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all declined for admin', () => {
    expect(component.declinedVisitors.length).toBe(3);
  });

  it('should filter declined visitors for owner', () => {
    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
      switch (key) {
        case 'userRole': return 'owner';
        case 'tower': return 'A';
        case 'flatNumber': return '101';
        default: return null;
      }
    });

    component = TestBed.createComponent(DeclinedVisitors).componentInstance;
    expect(component.declinedVisitors.length).toBe(2);
  });

  it('should handle non-array visitors safely', () => {
    service.getVisitors = signal(null as any);
    component = TestBed.createComponent(DeclinedVisitors).componentInstance;
    expect(component.declinedVisitors.length).toBe(0);
  });

  it('should calculate total pages correctly', () => {
    component.pageSize = 2;
    expect(component.totalPages).toBe(2);
  });

  it('should return 0 total pages if empty', () => {
    service.getVisitors = signal([]);
    component = TestBed.createComponent(DeclinedVisitors).componentInstance;
    expect(component.totalPages).toBe(0);
  });

  it('should paginate visitors correctly', () => {
    component.pageSize = 1;
    component.currentPage = 2;
    expect(component.paginatedVisitors.length).toBe(1);
  });

  it('should change page', () => {
    component.changePage(3);
    expect(component.currentPage).toBe(3);
  });

  it('should go to next page within limit', () => {
    component.pageSize = 2;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should not exceed next page limit', () => {
    component.pageSize = 2;
    component.currentPage = component.totalPages;
    component.nextPage();
    expect(component.currentPage).toBe(component.totalPages);
  });

  it('should go to previous page', () => {
    component.currentPage = 2;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should not go below page 1', () => {
    component.currentPage = 1;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });
});
