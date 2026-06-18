import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Publi {
  _id: string,
  titulo: string,
  descripcion: string,
  imagen: string,
  es_activo: boolean,
  me_gustas: string[],
  creador: {
    _id: string,
    nombre_usuario: string
  },
  cantidadComentarios?: number,
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class PubliServices {

  http = inject(HttpClient);

  async getPublicaciones(orden?: string, limite?: number, salto?: number, idCreador?: string){
    try {
      let params = new HttpParams();
      if(idCreador) params = params.set('idCreador', idCreador);

      if(orden) params = params.set('orden', orden);

      if(limite) params = params.set('limite', limite);

      if(salto) params = params.set('salto', salto);

      const respuesta = await firstValueFrom(this.http.get<Publi[]>(`${environment.apiURL}/publicaciones`, {params}));

      return respuesta;
    } catch (error) {
      throw new Error(`No se pudieron cargar las publicaciones, ${error}`);
    }
  }

  async getPublicacionById(id: string){
    try {
      const respuesta = await firstValueFrom(this.http.get<Publi>(`${environment.apiURL}/publicaciones/${id}`));

      return respuesta;
    } catch (error) {
      throw new Error(`No se pudo cargar la publicacion ${id}, ${error}`);
    }
  }

  async postPublicacion(datos: FormData){
    try {
      const respuesta = await firstValueFrom(this.http.post<Publi>(`${environment.apiURL}/publicaciones`, datos));

      return respuesta
    } catch (error) {
      throw new Error(`No se pudo crear la publicacion, ${error}`)
    }
  }

  async patchPublicacion(id: string, data: FormData){
    try {
      const respuesta = await firstValueFrom(this.http.patch<Publi>(`${environment.apiURL}/publicaciones/${id}`, data))

      return respuesta
    } catch (error) {
      throw new Error(`No se pudo modificar la publicacion, ${error}`)
    }
  }

  async postLike(id: string){
    try {
      const respuesta = await firstValueFrom(this.http.post<Publi>(`${environment.apiURL}/publicaciones/${id}/like`, null))

      return respuesta
    } catch (error) {
      throw new Error(`No se pudo modificar la publicacion, ${error}`)
    }
  }

  async deletePublicacion(id: string){
    try {
      const respuesta = await firstValueFrom(this.http.delete<Publi>(`${environment.apiURL}/publicaciones/${id}`));

      return respuesta;
    } catch (error) {
      throw new Error(`No se pudo borrar la publicacion, ${error}`)  
    }
  }
  
}
