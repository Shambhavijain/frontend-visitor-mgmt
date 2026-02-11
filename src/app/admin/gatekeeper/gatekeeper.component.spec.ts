import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatekeeperComponent } from './gatekeeper.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GatekepeperService } from '../../shared/services/gatekeeper.service';
import { ApiResponse } from '../../shared/models/api.response.model';
import { Gatekeeper } from '../../shared/models/gatekeeper.model';
import { UserRole } from '../../shared/enum/enum';

describe('GatekeeperComponent', () => {
    let component: GatekeeperComponent;
    let fixture: ComponentFixture<GatekeeperComponent>;
    let serviceSpy: jasmine.SpyObj<GatekepeperService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let messageService: MessageService;

    beforeEach(async () => {
        serviceSpy = jasmine.createSpyObj('GatekepeperService', [
            'listsGatekeeper',
            'addGatekeeper',
            'deletegatekeeper'
        ]);

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [GatekeeperComponent],
            providers: [
                { provide: GatekepeperService, useValue: serviceSpy },
                { provide: Router, useValue: routerSpy },
                MessageService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(GatekeeperComponent);
        component = fixture.componentInstance;
        messageService = TestBed.inject(MessageService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open and close modal', () => {
        component.openAddGatekeeperModal();
        expect(component.showAddGatekeeperModal).toBeTrue();

        component.closeAddGatekeeperModal();
        expect(component.showAddGatekeeperModal).toBeFalse();
    });

    it('should load list successfully', () => {
        const mockResponse: ApiResponse<Gatekeeper[]> = {
            status: 'success',
            data: [{ id: '1', username: 'A', email: '', address: '', role: UserRole.GATEKEEPER }],
            message: 'ok'
        };

        serviceSpy.listsGatekeeper.and.returnValue(of(mockResponse));

        component.showList();

        expect(component.users.length).toBe(1);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle showList error', () => {
        serviceSpy.listsGatekeeper.and.returnValue(
            throwError(() => new Error())
        );

        spyOn(messageService, 'add');

        component.showList();

        expect(component.isLoading).toBeFalse();
        expect(messageService.add).toHaveBeenCalled();
    });

    it('should submit gatekeeper success', () => {

        const mockGatekeeper: Gatekeeper = {
            id: '1',
            username: 'John',
            email:"mock.example.com",
            role:UserRole.GATEKEEPER,
            address:"mock-address"
        };

        const mockResponse: ApiResponse<Gatekeeper> = {
            status: 'success',
            data: mockGatekeeper,
            message: 'created'
        };

        serviceSpy.addGatekeeper.and.returnValue(of(mockResponse));

        spyOn(component, 'showList');
        spyOn(messageService, 'add');

        component.submitGatekeeperForm();

        expect(component.isLoading).toBeFalse();
        expect(component.showList).toHaveBeenCalled();
        expect(messageService.add).toHaveBeenCalled();
    });


    it('should handle submit error', () => {
        serviceSpy.addGatekeeper.and.returnValue(
            throwError(() => new Error())
        );

        spyOn(messageService, 'add');

        component.submitGatekeeperForm();

        expect(component.isLoading).toBeFalse();
        expect(messageService.add).toHaveBeenCalled();
    });

    it('should delete gatekeeper success', () => {
        component.users = [
            { id: '1', username: '', email: '', address: '', role: UserRole.GATEKEEPER }
        ];

        const mockResponse: ApiResponse<null> = {
            status: 'success',
            data: null,
            message: 'deleted'
        };

        serviceSpy.deletegatekeeper.and.returnValue(of(mockResponse));

        spyOn(messageService, 'add');

        component.deleteGatekeeper(0);

        expect(component.users.length).toBe(0);
        expect(component.isLoading).toBeFalse();
        expect(messageService.add).toHaveBeenCalled();
    });

    it('should handle delete error', () => {
        component.users = [
            { id: '1', username: '', email: '', address: '', role: UserRole.GATEKEEPER }
        ];

        serviceSpy.deletegatekeeper.and.returnValue(
            throwError(() => new Error())
        );

        spyOn(messageService, 'add');

        component.deleteGatekeeper(0);

        expect(component.isLoading).toBeFalse();
        expect(messageService.add).toHaveBeenCalled();
    });

    it('should handle pagination logic', () => {
        component.users = new Array(12).fill({
            id: '1',
            username: '',
            email: '',
            address: '',
            role: null
        });

        component.pageSize = 5;

        expect(component.totalPages).toBe(3);

        component.nextPage();
        expect(component.currentPage).toBe(2);

        component.prevPage();
        expect(component.currentPage).toBe(1);
    });

    it('should navigate back', () => {
        component.goBack();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
    });
});
