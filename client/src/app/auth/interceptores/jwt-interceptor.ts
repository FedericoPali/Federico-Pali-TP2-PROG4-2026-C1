import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token'); // agarramos el token desde el Local Storage

  if(token){
    const reqClon = req.clone({ // clonamos la request y le agregamos el header de autorizacion con el token para que se sepa quien esta pidiendo y si esta permitido a hacerlo
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(reqClon);
  }

  return next(req);
};
