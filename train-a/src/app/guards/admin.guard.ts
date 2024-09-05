import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';

export const adminGuard: CanActivateFn = async (): Promise<boolean> => {
  const loginService = inject(LoginService);
  const profile = await loginService.getProfile();
  return profile.role === 'manager';
};
