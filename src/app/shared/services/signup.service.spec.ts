import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SignupService } from './signup.service';
import { BASE_URL } from '../constants/baseUrl';
import { ApiResponse } from '../models/api.response.model';

describe('SignupService', () => {
  let service: SignupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignupService]
    });

    service = TestBed.inject(SignupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should signup user', () => {
    const mockResponse: ApiResponse<null> = {
      status: 'success',   // now correctly typed
      data: null,
      message: ''
    };

    service.signup({} as any).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.status).toBe('success');
      expect(res.data).toBeNull();
    });

    const req = httpMock.expectOne(`${BASE_URL}/auth/signup`);
    expect(req.request.method).toBe('POST');

    req.flush(mockResponse);
  });
});
