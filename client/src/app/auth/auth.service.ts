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

      return this.controlarResponse(respuesta);
    } catch(e){
      console.error(e);
      return this.controlarResponse(e);
    }
  }

  async registerUsuario(nombre: string, apellido: string, email: string, username: string , contraseña: string, fecha_nacimiento: string, descripcion?: string){
    try {
      
      const respuesta = await firstValueFrom(this.http.post("https://fedebackend.vercel.app/usuarios/crear", {nombre: nombre, apellido: apellido, email: email, nombre_usuario: username, contraseña: contraseña, fecha_nacimiento: fecha_nacimiento, descripcion_breve: descripcion }))
      
      return this.controlarResponse(respuesta);
    } catch (e) {
      return this.controlarResponse(e);
    }
  }

  async controlarResponse(response: any): Promise<string | null> {
    if(response.error){
      switch (response.error.message){
        case ("Los datos no coinciden"):
          throw new Error("El correo o contraseña son incorrectos"); 
                        
        case ("User already registered"):
          throw new Error("El correo se encuentra registrado");

        case ("Password should contain at least one character of each: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ, 0123456789."):
          throw new Error("La contraseña debe contener letras y numeros");

        default:
          throw new Error("Ocurrio un error: " + response.error.message);
      }
    } else {


      return response
    }
  }
}
