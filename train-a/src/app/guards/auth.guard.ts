import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const isAuthenticated = loginService.isAuthenticated();

  if (state.url === '/signin' && isAuthenticated) {
    router.navigate(['/']);
    return false;
  }

  if (state.url === '/orders' && !isAuthenticated) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
