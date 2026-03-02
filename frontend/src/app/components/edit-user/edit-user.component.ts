import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-header bg-warning text-dark">
              <h4 class="mb-0">Edit User <span *ngIf="userId">#{{ userId }}</span></h4>
            </div>
            <div class="card-body p-4">
              <div *ngIf="loadingUser" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ errorMessage }}
                <button type="button" class="btn-close" (click)="errorMessage=''"></button>
              </div>
              <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                {{ successMessage }}
                <button type="button" class="btn-close" (click)="successMessage=''"></button>
              </div>

              <form *ngIf="!loadingUser" [formGroup]="editForm" (ngSubmit)="onSubmit()">
                <div class="row g-3">
                  <div class="col-sm-6">
                    <label class="form-label fw-semibold">First Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="firstName"
                      [class.is-invalid]="isInvalid('firstName')">
                    <div class="invalid-feedback">First name is required.</div>
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label fw-semibold">Last Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="lastName"
                      [class.is-invalid]="isInvalid('lastName')">
                    <div class="invalid-feedback">Last name is required.</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" formControlName="email"
                      [class.is-invalid]="isInvalid('email')">
                    <div class="invalid-feedback">
                      <ng-container *ngIf="editForm.get('email')?.errors?.['required']">Email is required.</ng-container>
                      <ng-container *ngIf="editForm.get('email')?.errors?.['email']">Please enter a valid email.</ng-container>
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">Phone <span class="text-danger">*</span></label>
                    <input type="tel" class="form-control" formControlName="phone"
                      [class.is-invalid]="isInvalid('phone')">
                    <div class="invalid-feedback">
                      <ng-container *ngIf="editForm.get('phone')?.errors?.['required']">Phone is required.</ng-container>
                      <ng-container *ngIf="editForm.get('phone')?.errors?.['pattern']">Phone must be exactly 10 digits.</ng-container>
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">New Password <span class="text-muted">(optional)</span></label>
                    <input type="password" class="form-control" formControlName="password"
                      [class.is-invalid]="isInvalid('password')" placeholder="Leave blank to keep current">
                    <div class="invalid-feedback">Password must be at least 6 characters.</div>
                  </div>
                </div>

                <div class="d-flex gap-2 mt-4">
                  <button type="submit" class="btn btn-warning flex-grow-1" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Saving...' : 'Save Changes' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary" (click)="router.navigate(['/admin'])">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EditUserComponent implements OnInit {
  editForm: FormGroup;
  userId: number | null = null;
  loading = false;
  loadingUser = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number): void {
    this.loadingUser = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.loadingUser = false;
        this.editForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        });
      },
      error: (err) => {
        this.loadingUser = false;
        this.errorMessage = err?.error?.message || 'Failed to load user.';
      }
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.editForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValue = { ...this.editForm.value };
    if (!formValue.password) delete formValue.password;

    this.userService.updateUser(this.userId!, formValue).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'User updated successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/admin']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to update user.';
      }
    });
  }
}
