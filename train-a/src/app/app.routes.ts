import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';
import { OrdersComponent } from './pages/orders/orders.component';
import { CarriagesComponent } from './pages/carriages/carriages.component';
import { MapStationComponent } from './pages/map-stations/map-stations.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,

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
  {
    path: 'routes',
    loadComponent: () =>
      import('./pages/routes/routes.component').then(
        (m) => m.RoutesComponent,
      ),
    title: 'Routes',
    canActivate: [adminGuard],
  },
  {
    path: 'routes/:id',
    loadComponent: () =>
      import('./pages/routes/route-page/route-page.component').then(
        (m) => m.RoutePageComponent,
      ),
    title: 'Ride',
    canActivate: [adminGuard],
  },
    {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'carriages',
    component: CarriagesComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    title: 'Profile Page',
    canActivate: [loginGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: '404 Page',
  },
];
