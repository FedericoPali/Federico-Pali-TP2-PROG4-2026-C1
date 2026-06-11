import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  http = inject(HttpClient);

  router = inject(Router)

  idRelojSesion: any = null;

  idRelojDecision: any = null;

  esModalSesion = signal(false);

  relojSesion = 600000;

  relojDecision = 20000;

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

  async autorizar(token: string){
    try {
      const headers = {Authorization: `Bearer ${token}`};

      const usuario = await firstValueFrom(this.http.post(`${environment.apiURL}/auth/autorizar`, {}, {headers}));

      return usuario
    } catch (error) {
        console.error("Token invalido o vencido", error)
        throw error;
    }
  }

  async cerrarSesion(){
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
    this.limpiarRelojes();
    this.esModalSesion.set(false);
  }


  iniciarRelojSesion(){
    this.limpiarRelojes();

    this.idRelojSesion = setTimeout(() => {
      this.esModalSesion.set(true),
      console.log("Pasado los 10 minutos");

      this.iniciarRelojDecision();
    }, this.relojSesion)
  }

  iniciarRelojDecision(){
    this.idRelojDecision = setTimeout(() => {
      console.log("Se termino el tiempo de decision, redirigiendo al login")
      this.cerrarSesion();
    }, this.relojDecision)
  }

  limpiarRelojes() {
    if (this.idRelojSesion) clearTimeout(this.idRelojSesion);
    if (this.idRelojDecision) clearTimeout(this.idRelojDecision);
  }

  async extenderSesion() {
    try {
      const tokenViejo = localStorage.getItem('token');
      const respuesta: any = await firstValueFrom(
        this.http.post(environment.apiURL + "/auth/refrescar", { token: tokenViejo })
      );

      localStorage.setItem('token', respuesta.access_token);


      this.esModalSesion.set(false);
      this.iniciarRelojSesion();
      
    } catch (error) {
      console.error("Error al intentar extender sesion", error)
      this.cerrarSesion();
    }
  }
}
