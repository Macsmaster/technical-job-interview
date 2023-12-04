import { Routes } from '@angular/router';
import { HomeComponent } from './ui/pages/home/home.component';
import { RegisterFormComponent } from './ui/pages/register-form/register-form.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'create',
    loadComponent: () =>
      import('./ui/pages/register-form/register-form.component').then(
        (m) => m.RegisterFormComponent
      ),
  },

  {
    path: 'update/:id',
    loadComponent: () =>
      import('./ui/pages/register-form/register-form.component').then(
        (m) => m.RegisterFormComponent
      ),
  },
];
