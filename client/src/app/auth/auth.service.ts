import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  http = inject(HttpClient);

  async loginUsuario(identificador: string, contraseña: string) {
    try{
      // utilizo firstValueFrom para poder convertir el Observable en promesa, esta herramienta lo que hace es suscribirse al observable, espera a que llegue el primer paquete de datos y una vez pasa eso se desuscribe y transforma el dato en una promesa para poder usar el async y await.
      const respuesta = await firstValueFrom(this.http.post("https://fedebackend.vercel.app/usuarios/login", {identificador: identificador, contraseña: contraseña}));

      return respuesta;
    } catch(e){
      console.error(e);
      throw e;
    }
  }
}
