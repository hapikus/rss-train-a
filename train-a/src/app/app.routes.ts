import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    title: 'Main Page',
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
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
    title: 'Profile Page',
    canActivate: [loginGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    title: '404 Page',
  },
];
