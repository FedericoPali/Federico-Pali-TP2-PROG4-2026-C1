import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';


export interface User {
  _id: string,
  nombre: string,
  apellido: string,
  email: string,
  nombre_usuario: string,
  contrasena: string,
  fecha_nacimiento: string,
  imagen_perfil: string,
  es_admin: boolean,
  es_activo: boolean,
  descripcion_breve: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient);
  
  getUsuarioLogueado() {
    const token = localStorage.getItem('token');
    if(!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  }

  async getUsuarioByUsername(username: string){
    try {
      const usuario = await firstValueFrom(this.http.get<User>(`${environment.apiURL}/usuarios/${username}`));

      return usuario;
    } catch (error) {
      throw new Error(`No se pudieron cargar los datos del usuario, ${error}`);
    }
  }

  async getUsuarios(){
    try {
      const usuario = await firstValueFrom(this.http.get<User[]>(`${environment.apiURL}/usuarios`));

      return usuario;
    } catch (error) {
      throw new Error(`No se pudieron cargar los datos de los usuarios, ${error}`);
    }
  }

  async crearUsuario(datos: FormData){
    try {
      const usuario = await firstValueFrom(this.http.post<User>(`${environment.apiURL}/usuarios/crearPorAdmin`, datos));

      return usuario;
    } catch (error) {
      throw new Error(`No se pudo crear el usuario, ${error}`);
    }
  }

  async deshabilitarUsuario(username: string){
    try {
      const usuario = await firstValueFrom(this.http.delete<User>(`${environment.apiURL}/usuarios/${username}`));

      return usuario;
    } catch (error) {
      throw new Error(`No se pudo dar de baja al usuario, ${error}`);
    }
  }

  async rehabilitarUsuario(username: string){
    try {
      const usuario = await firstValueFrom(this.http.post<User>(`${environment.apiURL}/usuarios/rehabilitar/${username}`, null));

      return usuario;
    } catch (error) {
      throw new Error(`No se pudo dar de alta al usuario, ${error}`);
    }
  }
}
