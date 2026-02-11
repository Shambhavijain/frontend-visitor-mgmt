import { TestBed } from '@angular/core/testing';
import { PendingVisitors } from './pending-visitors';
import { VisitorService } from '../../../services/visitor.service';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { VisitorStatus } from '../../../enum/enum';

describe('PendingVisitors', () => {
  let component: PendingVisitors;
  let service: any;

  const mockVisitors = [
    { id: '1', status: 'PENDING', tower: 'A', flat_no: '101' },
    { id: '2', status: 'pending', tower: 'A', flat_no: 101 },
    { id: '3', status: 'APPROVED', tower: 'A', flat_no: '101' },
    { id: '4', status: 'PENDING', tower: 'B', flat_no: '202' }
  ];

  beforeEach(() => {
    service = {
      getVisitors: signal(mockVisitors),
      updateVisitorStatus: jasmine.createSpy().and.returnValue(of({})),
      getAllVisitors: jasmine.createSpy().and.returnValue(of({ data: [] }))
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
      imports: [PendingVisitors],
      providers: [{ provide: VisitorService, useValue: service }]
    });

    component = TestBed.createComponent(PendingVisitors).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute pending visitors for admin', () => {
    expect(component.pendingVisitors().length).toBe(3);
  });

  it('should filter pending visitors for owner', () => {
    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
      switch (key) {
        case 'userRole': return 'owner';
        case 'tower': return 'A';
        case 'flatNumber': return '101';
        default: return null;
      }
    });

    component = TestBed.createComponent(PendingVisitors).componentInstance;
    expect(component.pendingVisitors().length).toBe(2);
  });

  it('should return empty if no visitors', () => {
    service.getVisitors = signal([]);
    component = TestBed.createComponent(PendingVisitors).componentInstance;
    expect(component.pendingVisitors().length).toBe(0);
  });

  it('should compute total pages correctly', () => {
    component.pageSize = 2;
    expect(component.totalPages()).toBe(2);
  });

  it('should paginate correctly', () => {
    component.pageSize = 1;
    component.currentPage = 2;
    expect(component.paginatedVisitors().length).toBe(1);
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
    component.currentPage = component.totalPages();
    component.nextPage();
    expect(component.currentPage).toBe(component.totalPages());
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

  it('should return true for canModify when owner', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('owner');
    component = TestBed.createComponent(PendingVisitors).componentInstance;
    expect(component.canModify()).toBeTrue();
  });

  it('should return false for canModify when not owner', () => {
    expect(component.canModify()).toBeFalse();
  });

  it('should approve visitor and refresh', () => {
    component.approve({ id: '1' } as any);
    expect(service.updateVisitorStatus).toHaveBeenCalled();
    expect(service.getAllVisitors).toHaveBeenCalled();
  });

  it('should handle approve error', () => {
    service.updateVisitorStatus.and.returnValue(
      throwError(() => new Error('fail'))
    );
    component.approve({ id: '1' } as any);
    expect(service.updateVisitorStatus).toHaveBeenCalled();
  });

  it('should decline visitor and refresh', () => {
    component.decline({ id: '1' } as any);
    expect(service.updateVisitorStatus).toHaveBeenCalled();
    expect(service.getAllVisitors).toHaveBeenCalled();
  });

  it('should handle decline error', () => {
    service.updateVisitorStatus.and.returnValue(
      throwError(() => new Error('fail'))
    );
    component.decline({ id: '1' } as any);
    expect(service.updateVisitorStatus).toHaveBeenCalled();
  });

  it('should handle refreshVisitors error', () => {
    service.getAllVisitors.and.returnValue(
      throwError(() => new Error('fail'))
    );
    component.refreshVisitors();
    expect(service.getAllVisitors).toHaveBeenCalled();
  });
});
