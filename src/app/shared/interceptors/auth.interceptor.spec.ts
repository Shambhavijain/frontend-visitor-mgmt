import { AuthInterceptor } from './auth.interceptor';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockNext: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    interceptor = new AuthInterceptor();
    mockNext = jasmine.createSpyObj('HttpHandler', ['handle']);
    mockNext.handle.and.returnValue(of({} as HttpEvent<any>));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should pass login request without adding token', () => {
    const req = new HttpRequest('GET', '/api/login');

    interceptor.intercept(req, mockNext);

    expect(mockNext.handle).toHaveBeenCalledWith(req);
  });

  it('should pass signup request without adding token', () => {
    const req = new HttpRequest('GET', '/api/signup');

    interceptor.intercept(req, mockNext);

    expect(mockNext.handle).toHaveBeenCalledWith(req);
  });

  it('should add Authorization header if token exists', () => {
    localStorage.setItem('authToken', 'test-token');

    const req = new HttpRequest('GET', '/api/data');

    interceptor.intercept(req, mockNext);

    const handledRequest = mockNext.handle.calls.mostRecent().args[0];

    expect(handledRequest.headers.get('Authorization'))
      .toBe('Bearer test-token');
  });

  it('should not modify request if token does not exist', () => {
    const req = new HttpRequest('GET', '/api/data');

    interceptor.intercept(req, mockNext);

    expect(mockNext.handle).toHaveBeenCalledWith(req);
  });
});
