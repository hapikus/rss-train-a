import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';

export const loginGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  return loginService.isAuthenticated();
};
