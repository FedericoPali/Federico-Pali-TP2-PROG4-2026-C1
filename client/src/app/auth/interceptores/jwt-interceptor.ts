import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const token = localStorage.getItem('token'); // agarramos el token desde el Local Storage

  if(token){
    const reqClon = req.clone({ // clonamos la request y le agregamos el header de autorizacion con el token para que se sepa quien esta pidiendo y si esta permitido a hacerlo
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(reqClon).pipe(
      catchError((error) => {
        if(error.status === 401){
          localStorage.removeItem('token');
          router.navigate(['/auth/login'])
        }
        return throwError(() =>  error)
      })
    );
  }

  return next(req);
};
