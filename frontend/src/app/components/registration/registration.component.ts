import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password')?.value;
  return password && control.value !== password ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0"><i class="bi bi-person-plus"></i> User Registration</h4>
            </div>
            <div class="card-body p-4">
              <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                {{ successMessage }}
                <button type="button" class="btn-close" (click)="successMessage=''"></button>
              </div>
              <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ errorMessage }}
                <button type="button" class="btn-close" (click)="errorMessage=''"></button>
              </div>

              <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
                <div class="row g-3">
                  <div class="col-sm-6">
                    <label class="form-label fw-semibold">First Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="firstName"
                      [class.is-invalid]="isInvalid('firstName')" placeholder="John">
                    <div class="invalid-feedback">First name is required.</div>
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label fw-semibold">Last Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="lastName"
                      [class.is-invalid]="isInvalid('lastName')" placeholder="Doe">
                    <div class="invalid-feedback">Last name is required.</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" formControlName="email"
                      [class.is-invalid]="isInvalid('email')" placeholder="john.doe@example.com">
                    <div class="invalid-feedback">
                      <ng-container *ngIf="registrationForm.get('email')?.errors?.['required']">Email is required.</ng-container>
                      <ng-container *ngIf="registrationForm.get('email')?.errors?.['email']">Please enter a valid email address.</ng-container>
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">Phone <span class="text-danger">*</span></label>
                    <input type="tel" class="form-control" formControlName="phone"
                      [class.is-invalid]="isInvalid('phone')" placeholder="10-digit phone number">
                    <div class="invalid-feedback">
                      <ng-container *ngIf="registrationForm.get('phone')?.errors?.['required']">Phone is required.</ng-container>
                      <ng-container *ngIf="registrationForm.get('phone')?.errors?.['pattern']">Phone must be exactly 10 digits.</ng-container>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label fw-semibold">Password <span class="text-danger">*</span></label>
                    <input type="password" class="form-control" formControlName="password"
                      [class.is-invalid]="isInvalid('password')" placeholder="Min. 6 characters">
                    <div class="invalid-feedback">
                      <ng-container *ngIf="registrationForm.get('password')?.errors?.['required']">Password is required.</ng-container>
                      <ng-container *ngIf="registrationForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters.</ng-container>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label fw-semibold">Confirm Password <span class="text-danger">*</span></label>
                    <input type="password" class="form-control" formControlName="confirmPassword"
                      [class.is-invalid]="isInvalid('confirmPassword')" placeholder="Repeat password">
                    <div class="invalid-feedback">
                      <ng-container *ngIf="registrationForm.get('confirmPassword')?.errors?.['required']">Please confirm your password.</ng-container>
                      <ng-container *ngIf="registrationForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match.</ng-container>
                    </div>
                  </div>
                </div>

                <div class="d-grid mt-4">
                  <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Registering...' : 'Register' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator]]
    });

    this.registrationForm.get('password')?.valueChanges.subscribe(() => {
      this.registrationForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.registrationForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { confirmPassword, ...userData } = this.registrationForm.value;
    this.userService.createUser(userData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Registration successful! Redirecting to dashboard...';
        this.registrationForm.reset();
        setTimeout(() => this.router.navigate(['/admin']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
