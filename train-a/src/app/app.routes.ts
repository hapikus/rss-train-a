import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';

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
];
