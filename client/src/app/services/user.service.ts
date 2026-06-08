import { Injectable } from '@angular/core';


export interface User {
  _id: string,
  nombre: string,
  apellido: string,
  email: string,
  user_name: string,
  contrasena: string,
  fecha_nacimiento: string,
  imagen_perfil: string,
  es_admin: boolean,
  es_activo: boolean
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  getUsuarioLogueado() {
    const token = localStorage.getItem('token');
    if(!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
}
}
