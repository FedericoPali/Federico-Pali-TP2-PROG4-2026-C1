import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  http = inject(HttpClient);

  async loginUsuario(identificador: string, contrasena: string) {
    try{
      // utilizo firstValueFrom para poder convertir el Observable en promesa, esta herramienta lo que hace es suscribirse al observable, espera a que llegue el primer paquete de datos y una vez pasa eso se desuscribe y transforma el dato en una promesa para poder usar el async y await.
      const respuesta = await firstValueFrom(this.http.post(environment.apiURL + "/auth/login", {identificador: identificador, contrasena: contrasena}));

      return this.controlarResponse(respuesta);
    } catch(e){
      console.error(e);
      return this.controlarResponse(e);
    }
  }

  async registerUsuario(datos: FormData){
    try {
      
      const respuesta = await firstValueFrom(this.http.post(environment.apiURL + "/usuarios/crear", datos))
      
      return this.controlarResponse(respuesta);
    } catch (e) {
      return this.controlarResponse(e);
    }
  }

  async controlarResponse(response: any): Promise<string | null> {
    if(response.error){
      console.log("Error detallado del backend:", response.error);
      switch (response.error.message){
        case ("Los datos no coinciden"):
          throw new Error("El correo/usuario o contrasena son incorrectos"); 
                        
        case ("User already registered"):
          throw new Error("El correo se encuentra registrado");

        case ("Password should contain at least one character of each: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ, 0123456789."):
          throw new Error("La contrasena debe contener letras y numeros");

        default:
          throw new Error("Ocurrio un error: " + response.error.message);
      }
    } else {


      return response
    }
  }
}
