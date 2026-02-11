import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login } from './login';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginService } from '../../shared/services/login.service';

class MockLoginService {
  login = jasmine.createSpy();
}

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let loginService: MockLoginService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, HttpClientTestingModule],
      providers: [
        { provide: LoginService, useClass: MockLoginService },
        MessageService,
        provideRouter([])   // ✅ IMPORTANT FIX
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService) as any;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');

    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as touched if invalid', () => {
    component.onSubmit();
    expect(component.form.touched).toBeTrue();
  });

  it('should show email required error', () => {
    const email = component.form.controls.email;
    email.markAsTouched();
    expect(component.getEmailErrorMessage()).toBe('Email is required');
  });

  it('should show password minlength error', () => {
    const password = component.form.controls.password;
    password.setValue('123');
    password.markAsTouched();
    expect(component.getPasswordErrorMessage())
      .toContain('at least 6');
  });

  it('should login successfully as admin', fakeAsync(() => {
    const fakeToken = generateToken('admin');

    loginService.login.and.returnValue(of({
      data: { token: fakeToken, user: {} }
    }));

    component.form.setValue({
      email: 'test@test.com',
      password: 'pass123'
    });

    component.onSubmit();
    tick(1000);

    expect(localStorage.getItem('authToken')).toBe(fakeToken);
    expect(router.navigate).toHaveBeenCalledWith(
      ['/admin-dashboard'],
      { replaceUrl: true }
    );
    expect(component.isLoading).toBeFalse();
  }));

  it('should login successfully as gatekeeper', () => {
    const fakeToken = generateToken('gatekeeper');

    loginService.login.and.returnValue(of({
      data: { token: fakeToken, user: {} }
    }));

    component.form.setValue({
      email: 'test@test.com',
      password: 'pass123'
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(
      ['/gatekeeper-dashboard'],
      { replaceUrl: true }
    );
  });

  it('should handle login error', () => {
    loginService.login.and.returnValue(
      throwError(() => ({ message: 'Invalid credentials' }))
    );

    component.form.setValue({
      email: 'test@test.com',
      password: 'pass123'
    });

    component.onSubmit();

    expect(component.isLoading).toBeFalse();
  });

  it('should restore saved email on init', fakeAsync(() => {
    localStorage.setItem(
      'saved-login-form',
      JSON.stringify({ email: 'saved@test.com' })
    );

    component.ngOnInit();
    tick(500);

    expect(component.form.get('email')?.value)
      .toBe('saved@test.com');
  }));
});


function generateToken(role: string): string {
  const payload = {
    role,
    sub: '123'
  };
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}
