import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: RegistrationComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/edit/:id', component: EditUserComponent },
  { path: '**', redirectTo: '/register' }
];
