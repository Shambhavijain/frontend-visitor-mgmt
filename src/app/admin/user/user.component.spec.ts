import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { ApiResponse } from '../../shared/models/api.response.model';
import { User } from '../../shared/models/user.model';
import { UserRole } from '../../shared/enum/enum';

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        userServiceSpy = jasmine.createSpyObj('UserService', [
            'listUsers',
            'deleteUser'
        ]);

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [UserComponent],
            providers: [
                { provide: UserService, useValue: userServiceSpy },
                { provide: Router, useValue: routerSpy }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call showList on init', () => {
        spyOn(component, 'showList');
        component.ngOnInit();
        expect(component.showList).toHaveBeenCalled();
    });

    it('should load users successfully', () => {
        const mockUser: User = {
            id: '1',
            username: 'A',
            email: 'a@test.com',
            role: UserRole.OWNER,
            address: 'Some Address',
            flat_no: '101',
            tower: 'A'
        };

        const mockResponse: ApiResponse<User[]> = {
            status: 'success',
            data: [mockUser],
            message: 'ok'
        };

        userServiceSpy.listUsers.and.returnValue(of(mockResponse));

        component.showList();

        expect(component.users.length).toBe(1);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle showList error', () => {
        userServiceSpy.listUsers.and.returnValue(
            throwError(() => new Error())
        );

        component.showList();

        expect(component.isLoading).toBeFalse();
        expect(component.users.length).toBe(0);
    });

    it('should delete user successfully', () => {
        component.users = [
            {
                id: '1',
                username: 'A',
                email: 'a@test.com',
                role: UserRole.OWNER,
                address: 'Some Address',
                flat_no: '101',
                tower: 'A'
            }
        ];

        const mockResponse: ApiResponse<null> = {
            status: 'success',
            data: null,
            message: 'deleted'
        };

        userServiceSpy.deleteUser.and.returnValue(of(mockResponse));

        component.deleteUser(0);

        expect(component.users.length).toBe(0);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle delete error', () => {
        component.users = [
            {
                id: '1',
                username: 'A',
                email: 'a@test.com',
                role: UserRole.OWNER,
                address: 'Some Address',
                flat_no: '101',
                tower: 'A'
            }
        ];

        userServiceSpy.deleteUser.and.returnValue(
            throwError(() => new Error())
        );

        component.deleteUser(0);

        expect(component.isLoading).toBeFalse();
    });

    it('should calculate totalPages correctly', () => {
        component.users = new Array(12).fill({
            id: '1',
            username: '',
            email: '',
            role: UserRole.OWNER,
            address: '',
            flat_no: '',
            tower: ''
        });

        component.pageSize = 5;

        expect(component.totalPages).toBe(3);
    });

    it('should paginate users correctly', () => {
        component.users = [
            {
                id: '1',
                username: '',
                email: '',
                role: UserRole.OWNER,
                address: '',
                flat_no: '',
                tower: ''
            },
            {
                id: '2',
                username: '',
                email: '',
                role: UserRole.OWNER,
                address: '',
                flat_no: '',
                tower: ''
            },
            {
                id: '3',
                username: '',
                email: '',
                role: UserRole.OWNER,
                address: '',
                flat_no: '',
                tower: ''
            }
        ];

        component.pageSize = 2;
        component.currentPage = 2;

        expect(component.paginatedUsers.length).toBe(1);
    });

    it('should navigate back', () => {
        component.goBack();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
    });
});
