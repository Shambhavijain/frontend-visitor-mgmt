import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { DashboardService } from '../../shared/services/dashboard.service';
import { VisitorService } from '../../shared/services/visitor.service';

class MockDashboardService {
  visitorCount = { set: jasmine.createSpy('set') };
  gatekeeperCount = { set: jasmine.createSpy('set') };
  userCount = { set: jasmine.createSpy('set') };

  getVisitorCount = jasmine.createSpy().and.returnValue(
    of({ data: { count: 10 } })
  );

  getUsersCount = jasmine.createSpy().and.returnValue(
    of({ data: { Gatekeeper: 2, Owner: 5 } })
  );
}

class MockVisitorService {
  getVisitors = { set: jasmine.createSpy('set') };

  getAllVisitors = jasmine.createSpy().and.returnValue(
    of({
      data: [
        {
          id: 1,
          name: 'Test Visitor',
          status: 'approved',
          created_at: `${Math.floor(Date.now() / 1000)}`
        }
      ]
    })
  );
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: MockDashboardService;
  let visitorService: MockVisitorService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: VisitorService, useClass: MockVisitorService },
        MessageService,
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    dashboardService = TestBed.inject(DashboardService) as any;
    visitorService = TestBed.inject(VisitorService) as any;
    messageService = TestBed.inject(MessageService);

    spyOn(messageService, 'add');

    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isLoading true by default', () => {
    expect(component.isLoading).toBeTrue();
  });

  it('should load visitors successfully on init', () => {
    localStorage.setItem('userRole', 'admin');

    component.ngOnInit();

    expect(component.role).toBe('admin');
    expect(visitorService.getVisitors.set).toHaveBeenCalled();
    expect(component.visitors.length).toBeGreaterThan(0);
    expect(component.lastFiveVisitors.length).toBe(1);
    expect(component.isLoading).toBeFalse();
    expect(messageService.add).toHaveBeenCalled();
  });

  it('should handle visitor load error', () => {
    visitorService.getAllVisitors.and.returnValue(
      throwError(() => ({ message: 'Error' }))
    );

    component.ngOnInit();

    expect(component.visitors.length).toBe(0);
    expect(component.lastFiveVisitors.length).toBe(0);
    expect(component.isLoading).toBeFalse();
    expect(messageService.add).toHaveBeenCalled();
  });

  it('should load initial counts', () => {
    component.loadInitialCounts();

    expect(dashboardService.getVisitorCount).toHaveBeenCalled();
    expect(dashboardService.getUsersCount).toHaveBeenCalled();
    expect(dashboardService.visitorCount.set).toHaveBeenCalledWith(10);
    expect(dashboardService.gatekeeperCount.set).toHaveBeenCalledWith(2);
    expect(dashboardService.userCount.set).toHaveBeenCalledWith(5);
  });

  it('should handle user count error branch', () => {
    dashboardService.getUsersCount.and.returnValue(
      throwError(() => ({ message: 'error' }))
    );

    component.loadInitialCounts();

    expect(dashboardService.getUsersCount).toHaveBeenCalled();
  });

  it('should detect admin role correctly', () => {
    component.role = 'admin';
    expect(component.isAdmin).toBeTrue();
  });

  it('should detect gatekeeper role correctly', () => {
    component.role = 'gatekeeper';
    expect(component.isGatekeeper).toBeTrue();
  });

  it('should detect owner or tenant role correctly', () => {
    component.role = 'owner';
    expect(component.isOwnerOrTenant).toBeTrue();

    component.role = 'tenant';
    expect(component.isOwnerOrTenant).toBeTrue();
  });
});
