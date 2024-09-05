import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign-Up Page',
  },
  {
    path: 'signin',
    component: LoginPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'routes',
    loadComponent: () => import('./pages/routes/routes.component').then((m) => m.RoutesComponent),
    title: 'Routes',
    canActivate: [adminGuard],
  },
  {
    path: 'routes/:id',
    loadComponent: () => import('./pages/ride/route.component').then((m) => m.RouteComponent),
    title: 'Ride',
    canActivate: [adminGuard],
  },
];
