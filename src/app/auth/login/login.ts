import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../shared/services/login.service';
import { Router, RouterModule } from '@angular/router';
import { debounceTime } from 'rxjs';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { LoginRequest } from '../../shared/models/model';
import { constString } from '../../shared/constants/constStr';


function noSpaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  return !value.includes('@') ? { ContainsSpaces: true } : null;
}
function mustfollowpattern(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const hasDigit = /\d/.test(value);
  return hasDigit ? null : { mustFollowPattern: true };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ToastModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  constString = constString;
  isLoggedIn = false;
  isLoading = false;
  private loginService = inject(LoginService)
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private router = inject(Router)

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, noSpaceValidator],

    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(12), mustfollowpattern]
    })
  });

  getEmailErrorMessage(): string | null {
    const control = this.form.controls.email;
    if (control.touched || control.dirty) {
      if (control.hasError('required')) {
        return 'Email is required';
      }
      if (control.hasError('ContainsSpaces')) {
        return 'Email must contain @';
      }
    }
    return null;
  }

  getPasswordErrorMessage(): string | null {
    const control = this.form.controls.password;
    if (control.touched || control.dirty) {
      if (control.hasError('required')) {
        return 'Password is required';
      }
      if (control.hasError('minlength')) {
        return 'Password must be at least 6 characters';
      }
      if (control.hasError('maxlength')) {
        return 'Password must be at most 12 characters';
      }
      if (control.hasError('mustFollowPattern')) {
        return 'Password must contain at least one digit';
      }
    }
    return null;
  }

  onSubmit(): void {
    const credentials: LoginRequest = {
      email: this.form.get('email')?.value ?? '',
      password: this.form.get('password')?.value ?? ''
    };

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.valid) {

      this.isLoading = true;
      this.loginService.login(credentials).subscribe({

        next: (response) => {
          console.log('Login response:', response)
          const token = response.data.token;
          localStorage.setItem('authToken', token);
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log("payload get", payload)
          const role = payload.role;
          const user_id = payload.sub;

          localStorage.setItem('userRole', role);
          localStorage.setItem('userId', user_id);
          localStorage.removeItem('tower');
          localStorage.removeItem('flatNumber');
          if (role === 'owner') {
            const tower = response.data.user.tower ?? null;
            const flat = response.data.user.flat_no ?? null;

            if (tower) localStorage.setItem('tower', tower);
            if (flat) localStorage.setItem('flatNumber', flat);

          }

          localStorage.setItem('isLoggedIn', 'true');

          this.form.reset();
          localStorage.removeItem('saved-login-form');

          if (role === 'admin') {
            localStorage.setItem('isLoggedIn', 'true');
            setTimeout(() => {
              this.router.navigate(['/admin-dashboard'], { replaceUrl: true });
            }, 1000);

          } else if (role === 'gatekeeper') {
            localStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/gatekeeper-dashboard'], { replaceUrl: true });
          } else if (role === 'owner' || role === 'tenant') {
            localStorage.setItem('isLoggedIn', 'true');
            this.router.navigate(['/owner-dashboard'], { replaceUrl: true });
          } else {
            this.router.navigate(['/unauthorized'], { replaceUrl: true });
          }
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successfully',
            detail: 'User Login successfully',

          });
        },
        error: (err) => {
          this.form.reset();
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Failed to Login ',

          });
        }
      })
    }
  }

  ngOnInit(): void {

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      const savedForm = window.localStorage.getItem('saved-login-form');
      if (savedForm) {
        const loadedForm = JSON.parse(savedForm);
        this.form.patchValue({
          email: loadedForm.email,
        });
      }

      const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
        next: value => {
          if (value.email?.trim()) {
            window.localStorage.setItem('saved-login-form',
              JSON.stringify({ email: value.email })
            );
          }
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }

}