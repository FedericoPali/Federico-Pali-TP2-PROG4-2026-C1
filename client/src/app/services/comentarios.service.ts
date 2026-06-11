import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Comentario {
  _id: string,
  contenido: string,
  creador: {
    _id: string,
    nombre_usuario: string
  }
  publicacionId: string,
  es_activo: boolean,
  modificado: boolean,
}

@Injectable({
  providedIn: 'root',
})
export class ComentariosService {
  http = inject(HttpClient);

  async getComentarios(idPublicacion: string, limite?: number, salto?: number){
    try {
      let params = new HttpParams();

      params = params.set('publicacionId', idPublicacion);

      if(limite) params = params.set('limite', limite);

      if(salto) params =  params.set('salto', salto);

      const comentarios = await firstValueFrom(this.http.get<Comentario[]>(`${environment.apiURL}/publicaciones/${idPublicacion}/comentarios`, {params}));

      return comentarios;

    } catch (error) {
      throw new Error(`Error al tratar de conseguir los comentarios, ${error}`)
    }
  }

  async getComentarioById(idPublicacion: string, id: string){
    try {
      const respuesta = await firstValueFrom(this.http.get<Comentario>(`${environment.apiURL}/publicaciones/${idPublicacion}/comentarios/${id}`));
    
      return respuesta;
    } catch (error) {
      throw new Error(`No se pudo cargar el comentario ${id}, ${error}`);
    }
  }

  async patchComentario(idPublicacion: string, id: string, contenido: string){
    try {
      const respuesta = await firstValueFrom(this.http.patch<Comentario>(`${environment.apiURL}/publicaciones/${idPublicacion}/comentarios/${id}`, { contenido: contenido }))
    
      return respuesta
    } catch (error) {
      throw new Error(`No se pudo modificar la publicacion, ${error}`)
    }
  }

  async postComentario(idPublicacion: string, contenido: string){
    try {
      const respuesta = await firstValueFrom(this.http.post<Comentario>(`${environment.apiURL}/publicaciones/${idPublicacion}/comentarios`, { contenido: contenido }));
  
      return respuesta
    } catch (error) {
      throw new Error(`No se pudo crear el comentario, ${error}`)
    }
  }

  async deleteComentario(idPublicacion: string, id: string){
    try {
      const respuesta = await firstValueFrom(this.http.delete<Comentario>(`${environment.apiURL}/publicaciones/${idPublicacion}/comentarios/${id}`));
  
      return respuesta
    } catch (error) {
      throw new Error(`No se pudo eliminar el comentario, ${error}`)
    }
  }
}
