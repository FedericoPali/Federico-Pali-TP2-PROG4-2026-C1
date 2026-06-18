import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    await authService.autorizar(token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    if(!payload.es_admin){
      router.navigate(['/pages/publicaciones']);
      return false;
    }
    return true;  
  } catch (error) {
    localStorage.removeItem('token');
    router.navigate(['/auth/login']);
    return false;
  }
};
