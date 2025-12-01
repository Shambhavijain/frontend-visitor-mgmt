import { Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DestroyRef } from '@angular/core';
import { requestUser } from '../../shared/models/model';
import { SignupService } from '../../shared/services/signup.service';
import { NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { constString } from '../../shared/constants/constStr';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
function mustMatchPassword(control1: string, control2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.get(control1);
    const val2 = control.get(control2)
    if (!val || !val2) {
      return null;
    }
    if (val.value !== val2.value) {
      val2.setErrors({ mustMatch: true })
    } else {
      val2.setErrors(null);
    }
    return null;
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
      validators: [Validators.required, Validators.minLength(6)]
    }),
    confirmpassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    address: new FormControl('', {
      validators: [Validators.required]
    }),
    flat_no: new FormControl('', {
      validators: [Validators.required]
    }),
    tower: new FormControl('', {
      validators: [Validators.required]
    })
  }, { validators: mustMatchPassword('password', 'confirmpassword') });

  getEmailValid(): boolean {
    return this.form.controls.email.invalid &&
      this.form.controls.email.touched &&
      this.form.controls.email.dirty
  }
  getPasswordValid(): boolean {
    return this.form.controls.password.invalid &&
      this.form.controls.password.touched &&
      this.form.controls.password.dirty
  }


  onSubmit(): void {
    const requestUser: requestUser = {
      name: this.form.get('name')?.value ?? '',
      email: this.form.get('email')?.value ?? '',
      password: this.form.get('password')?.value ?? '',
      address: this.form.get('address')?.value ?? '',
      flat_no: this.form.get('flat_no')?.value ?? '',
      tower: this.form.get('tower')?.value ?? ''
    };

    console.log("Form submitted")
    if (this.form.valid) {
      const subscription = this.signupService.signup(requestUser)
        .subscribe({
          next: (res) => {

            this.isSignedup = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Signup Successfully',
              detail: res.message || 'User Signup successfully',
              life: 1500

            });

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);

          },
          error: (err) => {
            console.error('Signup failed:', err);

            if (err.status === 409) {
              this.errorMessage = 'Username already exists. Please choose a different one.';

              this.messageService.add({
                severity: 'error',
                summary: 'Signup Error',
                detail: this.errorMessage,
              });

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
