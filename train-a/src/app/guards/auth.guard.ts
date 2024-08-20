import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const isAuthenticated = loginService.isAuthenticated();

  if (isAuthenticated) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
