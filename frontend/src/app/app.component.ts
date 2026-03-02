import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">&#128100; UserApp</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/register" routerLinkActive="active">Register</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active">Admin Dashboard</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
