import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/pharmacy/pages/pharmacy-guard-page/pharmacy-guard-page.component'),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
