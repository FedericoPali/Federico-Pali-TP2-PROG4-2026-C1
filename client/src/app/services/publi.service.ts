import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Publi {
  _id: string,
  titulo: string,
  descripcion: string,
  imagen: string,
  es_activo: boolean,
  me_gustas: string[],
  creador: string,
  cantidadComentarios?: number
}

@Injectable({
  providedIn: 'root',
})
export class PubliServices {

  http = inject(HttpClient);

  async getPublicaciones(){
    try {
      const respuesta = await firstValueFrom(this.http.get<Publi[]>(`${environment.apiURL}/publicaciones`));

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

  async postPublicacion(titulo: string, descripcion: string, imagen?: string){
    try {
      const respuesta = await firstValueFrom(this.http.post<Publi>(`${environment.apiURL}/publicaciones`, {titulo: titulo, descripcion: descripcion, imagen: imagen}));

      return respuesta
    } catch (error) {
      throw new Error(`No se pudo crear la publicacion, ${error}`)
    }
  }

  async patchPublicacion(id: string, data: {titulo?:string, descripcion?:string}){
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
