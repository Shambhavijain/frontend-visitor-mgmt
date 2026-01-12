import { Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DestroyRef } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { SignupService } from '../../shared/services/signup.service';
import { constString } from '../../shared/constants/constStr';
import { SignUpRequest } from '../../shared/models/auth.model';
import { ApiResponse } from '../../shared/models/api.response.model';


function mustMatchPassword(password: string, confirmPassword: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get(password)?.value;
    const confirm = group.get(confirmPassword)?.value;

    if (!pass || !confirm) {
      return null;
    }

    return pass === confirm ? null : { mustMatch: true };
  };
}



@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NgIf, CommonModule, ToastModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  constString = constString;
  errorMessage = '';
  private signupService = inject(SignupService);
  private messageService = inject(MessageService);
  isSignedup = false;
  private destroyRef = inject(DestroyRef);
  private router = inject(Router)
  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*\d).+$/)
      ]
    }),

    confirmpassword: new FormControl('', {
      validators: [Validators.required]
    }),

    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    address: new FormControl('', {
      validators: [Validators.required]
    }),
    flat_no: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^\d{4}$/)
      ]
    }),

    tower: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[A-Z]+$/)
      ]
    }),

  }, { validators: mustMatchPassword('password', 'confirmpassword') });

  isInvalid(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get emailCtrl() {
    return this.form.get('email');
  }

  get passwordCtrl() {
    return this.form.get('password');
  }

  get confirmPasswordCtrl() {
    return this.form.get('confirmpassword');
  }

  onSubmit(): void {
    const requestUser: SignUpRequest = {
      Name: this.form.get('name')?.value ?? '',
      Email: this.form.get('email')?.value ?? '',
      Password: this.form.get('password')?.value ?? '',
      Address: this.form.get('address')?.value ?? '',
      FlatNo: this.form.get('flat_no')?.value ?? '',
      Tower: this.form.get('tower')?.value ?? ''
    };

    console.log("Form submitted")
    if (this.form.valid) {
      const subscription = this.signupService.signup(requestUser)
        .subscribe({
          next: (res: ApiResponse<null>) => {

            this.isSignedup = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Signup Successfully',
              detail: res.message || 'User Signup successfully',
              life: 1500

            });
            this.form.reset();

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);

          },
          error: (err) => {
            console.error('Signup failed:', err);

            if (err.status === 409) {
              const emailCtrl = this.form.get('email');

              emailCtrl?.setErrors({
                ...emailCtrl.errors,
                emailExists: true
              });
              emailCtrl?.markAsTouched();

              this.errorMessage = 'Email already exists. Please choose a different one.';

              this.messageService.add({
                severity: 'error',
                summary: 'Signup Error',
                detail: this.errorMessage,
              });
              this.form.reset();


            } else {
              this.errorMessage = 'Signup failed. Please try again.';
              this.messageService.add({
                severity: 'error',
                summary: 'Signup Error',
                detail: err.message || this.errorMessage,
              });
            }
            this.isSignedup = false;
          }
        });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe()
      })
    }
  }

}