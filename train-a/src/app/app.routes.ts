import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';
import { MapStationComponent } from './pages/map-stations/map-stations.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    title: 'Main Page',
  },
  {
    path: 'stations',
    component: MapStationComponent,
    title: 'Stations',
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
