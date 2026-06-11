import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    await authService.autorizar(token); 
    return true; 
  } catch (error) {
    localStorage.removeItem('token');
    router.navigate(['/auth/login']);
    return false;
  }
};
