import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Admin Dashboard</h2>
        <button class="btn btn-success" (click)="router.navigate(['/register'])">
          <span class="me-1">+</span> Register New User
        </button>
      </div>

      <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" (click)="errorMessage=''"></button>
      </div>
      <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ successMessage }}
        <button type="button" class="btn-close" (click)="successMessage=''"></button>
      </div>

      <div class="card shadow-sm">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <span class="fw-semibold">Users ({{ users.length }})</span>
          <button class="btn btn-sm btn-outline-light" (click)="loadUsers()">&#8635; Refresh</button>
        </div>
        <div class="card-body p-0">
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div *ngIf="!loading && users.length === 0" class="text-center py-5 text-muted">
            <p class="mb-2">No users found.</p>
            <button class="btn btn-primary btn-sm" (click)="router.navigate(['/register'])">Register First User</button>
          </div>

          <div *ngIf="!loading && users.length > 0" class="table-responsive">
            <table class="table table-hover table-striped mb-0">
              <thead class="table-dark">
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of pagedUsers">
                  <td>{{ user.id }}</td>
                  <td>{{ user.firstName }}</td>
                  <td>{{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone }}</td>
                  <td>{{ user.createdAt ? (user.createdAt | date:'mediumDate') : '—' }}</td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="editUser(user)">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" (click)="deleteUser(user)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div *ngIf="!loading && totalPages > 1" class="card-footer d-flex justify-content-between align-items-center">
          <small class="text-muted">Page {{ currentPage }} of {{ totalPages }}</small>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <a class="page-link" (click)="changePage(currentPage - 1)" style="cursor:pointer">Previous</a>
              </li>
              <li *ngFor="let p of pageNumbers" class="page-item" [class.active]="p === currentPage">
                <a class="page-link" (click)="changePage(p)" style="cursor:pointer">{{ p }}</a>
              </li>
              <li class="page-item" [class.disabled]="currentPage === totalPages">
                <a class="page-link" (click)="changePage(currentPage + 1)" style="cursor:pointer">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  currentPage = 1;
  pageSize = 10;

  constructor(public router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => { this.users = data; this.loading = false; this.currentPage = 1; },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to load users.';
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  editUser(user: User): void {
    this.router.navigate(['/admin/edit', user.id]);
  }

  deleteUser(user: User): void {
    if (!window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) return;
    this.userService.deleteUser(user.id!).subscribe({
      next: () => {
        this.successMessage = `User ${user.firstName} ${user.lastName} deleted successfully.`;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to delete user.';
      }
    });
  }
}
