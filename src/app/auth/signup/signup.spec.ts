import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Signup } from './signup';
import { SignupService } from '../../shared/services/signup.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockSignupService {
    signup = jasmine.createSpy();
}

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('Signup Component', () => {
    let fixture: ComponentFixture<Signup>;
    let component: Signup;
    let signupService: MockSignupService;
    let router: MockRouter;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Signup],
            providers: [
                { provide: SignupService, useClass: MockSignupService },
                { provide: Router, useClass: MockRouter },
                MessageService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(Signup);
        component = fixture.componentInstance;
        signupService = TestBed.inject(SignupService) as any;
        router = TestBed.inject(Router) as any;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should detect invalid control', () => {
        const control = component.form.get('email');
        control?.markAsTouched();
        expect(component.isInvalid(control)).toBeTrue();
    });

    it('should signup successfully', fakeAsync(() => {
        signupService.signup.and.returnValue(of({
            status: 'success',
            message: 'Success',
            data: null
        }));

        component.form.setValue({
            name: 'Test',
            email: 'test@test.com',
            password: 'pass123',
            confirmpassword: 'pass123',
            address: 'addr',
            flat_no: '1234',
            tower: 'A'
        });

        component.onSubmit();
        tick(1500);

        expect(component.isSignedup).toBeTrue();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should handle 409 email exists error', () => {
        signupService.signup.and.returnValue(
            throwError(() => ({ status: 409 }))
        );

        component.form.setValue({
            name: 'Test',
            email: 'test@test.com',
            password: 'pass123',
            confirmpassword: 'pass123',
            address: 'addr',
            flat_no: '1234',
            tower: 'A'
        });

        component.onSubmit();

        expect(component.errorMessage).toContain('Email already exists');
        expect(component.isSignedup).toBeFalse();
    });

    it('should handle generic signup error', () => {
        signupService.signup.and.returnValue(
            throwError(() => ({ status: 500, message: 'Server error' }))
        );

        component.form.setValue({
            name: 'Test',
            email: 'test@test.com',
            password: 'pass123',
            confirmpassword: 'pass123',
            address: 'addr',
            flat_no: '1234',
            tower: 'A'
        });

        component.onSubmit();

        expect(component.errorMessage).toContain('Signup failed');
        expect(component.isSignedup).toBeFalse();
    });
});
