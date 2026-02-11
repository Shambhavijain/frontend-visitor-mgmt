import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { constString } from '../../constants/constStr';
import { ApiResponse } from '../../models/api.response.model';
import { User } from '../../models/user.model';
import { UserRole } from '../../enum/enum';

describe('Header Component', () => {
  let fixture: ComponentFixture<Header>;
  let component: Header;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct app name', () => {
    expect(component.appName).toBe('Visitor Management System');
  });

  it('should expose constString', () => {
    expect(component.constString).toBe(constString);
  });


  it('should toggle dropdown', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.toggleDropDown(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.showDropdown).toBeTrue();

    component.toggleDropDown(event);
    expect(component.showDropdown).toBeFalse();
  });

  it('should close dropdown via host listener', () => {
    component.showDropdown = true;
    component.closeDropDown();
    expect(component.showDropdown).toBeFalse();
  });


  it('should fetch user when role is owner', () => {
    localStorage.setItem('userRole', 'owner');

    const mockResponse: ApiResponse<User> = {
      status: 'success',
      data: {
        id: '1',
        username: 'TestUser',
        email: 'test@mail.com',
        role: UserRole.OWNER,
        address: '',
        flat_no: '',
        tower: ''
      },
      message: 'ok'
    };

    userServiceSpy.getCurrentUser.and.returnValue(of(mockResponse));

    component.role = 'owner';
    component.ngOnInit();

    expect(userServiceSpy.getCurrentUser).toHaveBeenCalled();
  });


  it('should handle error while fetching user', () => {
    localStorage.setItem('userRole', 'owner');
    spyOn(console, 'error');

    userServiceSpy.getCurrentUser.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.role = 'owner';
    component.ngOnInit();

    expect(console.error).toHaveBeenCalled();
  });


  it('should not call API when role is not owner', () => {
    component.role = 'admin';
    component.ngOnInit();

    expect(userServiceSpy.getCurrentUser).not.toHaveBeenCalled();
  });


  it('should clear localStorage and navigate on logout', () => {
    localStorage.setItem('userRole', 'owner');
    localStorage.setItem('isLoggedIn', 'true');

    component.logout();

    expect(localStorage.getItem('userRole')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
