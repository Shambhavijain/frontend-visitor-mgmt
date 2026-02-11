import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Visitors } from './visitors';
import { VisitorService } from '../../services/visitor.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { VisitorStatus } from '../../enum/enum';
import { ApiResponse } from '../../models/api.response.model';
import { Visitor } from '../../models/visitor.model';

class MockVisitorService {
  getVisitors = signal<Visitor[]>([]);

  getAllVisitors = jasmine.createSpy().and.returnValue(
    of<ApiResponse<Visitor[]>>({
      status: 'success',
      data: [],
      message: 'ok'
    })
  );

  addVisitor = jasmine.createSpy().and.returnValue(
    of<ApiResponse<Visitor>>({
      status: 'success',
      data: {
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        tower: 'A',
        flat_no: '101',
        status: VisitorStatus.PENDING,
        created_at: '123'
      },
      message: 'created'
    })
  );
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('Visitors Component', () => {
  let fixture: ComponentFixture<Visitors>;
  let component: Visitors;
  let service: MockVisitorService;
  let router: MockRouter;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Visitors],
      providers: [
        { provide: VisitorService, useClass: MockVisitorService },
        { provide: Router, useClass: MockRouter },
        MessageService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Visitors);
    component = fixture.componentInstance;
    service = TestBed.inject(VisitorService) as any;
    router = TestBed.inject(Router) as any;
    messageService = TestBed.inject(MessageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load visitors on init success', () => {
    spyOn(messageService, 'add');
    component.ngOnInit();
    expect(component.isLoading).toBeFalse();
    expect(messageService.add).toHaveBeenCalled();
  });

  it('should handle init error', () => {
    service.getAllVisitors.and.returnValue(
      throwError(() => new Error('fail'))
    );
    spyOn(messageService, 'add');
    component.ngOnInit();
    expect(component.isLoading).toBeFalse();
    expect(messageService.add).toHaveBeenCalled();
  });

  it('should navigate to admin dashboard', () => {
    spyOn(localStorage, 'getItem').and.returnValue('admin');
    component.navigateByRole();
    expect(router.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  });

  it('should navigate to owner dashboard', () => {
    spyOn(localStorage, 'getItem').and.returnValue('owner');
    component.navigateByRole();
    expect(router.navigate).toHaveBeenCalledWith(['/owner-dashboard']);
  });

  it('should navigate to gatekeeper dashboard', () => {
    spyOn(localStorage, 'getItem').and.returnValue('gatekeeper');
    component.navigateByRole();
    expect(router.navigate).toHaveBeenCalledWith(['/gatekeeper-dashboard']);
  });

  it('should not navigate if role is unknown', () => {
    spyOn(localStorage, 'getItem').and.returnValue('unknown');
    component.navigateByRole();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call goBackByRole', () => {
    spyOn(component, 'navigateByRole');
    component.goBackByRole();
    expect(component.navigateByRole).toHaveBeenCalled();
  });

  it('should open and close modal', () => {
    component.openAddVisitorModal();
    expect(component.showAddVisitorModal).toBeTrue();
    component.closeAddVisitorModal();
    expect(component.showAddVisitorModal).toBeFalse();
  });

  it('should switch tab', () => {
    component.switchTab('declined');
    expect(component.activeTab).toBe('declined');
  });

  it('should reset form on cancel', () => {
    const mockForm: any = { resetForm: jasmine.createSpy() };
    component.onCancel(mockForm);
    expect(mockForm.resetForm).toHaveBeenCalled();
    expect(component.newVisitor.status).toBe(VisitorStatus.PENDING);
  });

  it('should submit visitor success with modal instance', () => {
    spyOn(messageService, 'add');
    const mockForm: any = { resetForm: jasmine.createSpy() };

    (window as any).bootstrap = {
      Modal: {
        getInstance: () => ({
          hide: jasmine.createSpy('hide')
        })
      }
    };

    component.submitVisitorForm(mockForm);

    expect(component.isLoading).toBeFalse();
    expect(messageService.add).toHaveBeenCalled();
    expect(service.getAllVisitors).toHaveBeenCalled();
  });

  it('should submit visitor success without modal instance', () => {
    spyOn(messageService, 'add');
    const mockForm: any = { resetForm: jasmine.createSpy() };

    (window as any).bootstrap = {
      Modal: {
        getInstance: () => null
      }
    };

    component.submitVisitorForm(mockForm);

    expect(component.isLoading).toBeFalse();
    expect(messageService.add).toHaveBeenCalled();
  });

  it('should handle submit error', () => {
    service.addVisitor.and.returnValue(
      throwError(() => new Error('error'))
    );
    spyOn(messageService, 'add');
    const mockForm: any = { resetForm: jasmine.createSpy() };

    component.submitVisitorForm(mockForm);

    expect(component.isLoading).toBeFalse();
    expect(messageService.add).toHaveBeenCalled();
  });
});
