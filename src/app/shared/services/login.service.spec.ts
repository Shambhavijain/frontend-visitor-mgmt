import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { BASE_URL } from '../constants/baseUrl';
import { ApiResponse } from '../models/api.response.model';

describe('LoginService', () => {

  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user successfully', () => {

    const credentials = {
      email: 'test@example.com',
      password: '123456'
    };

    const mockResponse: ApiResponse<any> = {
      status: 'success',
      data: {
        token: 'abc123',
        role: 'owner'
      },
      message: 'Login successful'
    };

    service.login(credentials).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.status).toBe('success');
    });

    const req = httpMock.expectOne(`${BASE_URL}/auth/login`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

});
