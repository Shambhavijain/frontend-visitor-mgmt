import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { BASE_URL } from '../constants/baseUrl';
import { ApiResponse } from '../models/api.response.model';
import { User } from '../models/user.model';
import { UserRole } from '../enum/enum';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  
  it('should return user role from localStorage', () => {
    localStorage.setItem('role', 'ADMIN');
    expect(service.getUserRole()).toBe('ADMIN');
  });

 
  it('should return empty string if role not present', () => {
    localStorage.removeItem('role');
    expect(service.getUserRole()).toBe('');
  });

  it('should list users', () => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'TestUser',
        email: 'test@mail.com',
        role: UserRole.ADMIN,
        address: 'Address',
        flat_no: '101',
        tower: 'A'
      }
    ];

    const mockResponse: ApiResponse<User[]> = {
      status: 'success',
      data: mockUsers,
      message: ''
    };

    service.listUsers().subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.data.length).toBe(1);
    });

    const req = httpMock.expectOne(`${BASE_URL}/users/`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should delete user', () => {
    const mockResponse: ApiResponse<null> = {
      status: 'success',
      data: null,
      message: ''
    };

    service.deleteUser('1').subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.data).toBeNull();
    });

    const req = httpMock.expectOne(`${BASE_URL}/users/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  
  it('should get current user using userId from localStorage', () => {
    localStorage.setItem('userId', '1');

    const mockUser: User = {
      id: '1',
      username: 'TestUser',
      email: 'test@mail.com',
      role: UserRole.ADMIN,
      address: 'Address',
      flat_no: '101',
      tower: 'A'
    };

    const mockResponse: ApiResponse<User> = {
      status: 'success',
      data: mockUser,
      message: ''
    };

    service.getCurrentUser().subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.data.username).toBe('TestUser');
    });

    const req = httpMock.expectOne(`${BASE_URL}/users/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
