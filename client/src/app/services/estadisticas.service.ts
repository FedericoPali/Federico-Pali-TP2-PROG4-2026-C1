import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  http = inject(HttpClient);

  async getPublicacionesByUsuario(fechaInicio: string, fechaFin: string){
    try {
      let params = new HttpParams();

      params = params.set('fechaInicio', fechaInicio);
      params = params.set('fechaFin', fechaFin);

      const respuesta = await firstValueFrom(this.http.get(`${environment.apiURL}/estadisticas/publicaciones-por-usuario`, {params}));

      return respuesta
    } catch (error) {
      throw new Error(`No se pudieron cargar las publicaciones, ${error}`);
    }
  }
  
  async getComentariosByTiempo(fechaInicio: string, fechaFin: string){
    try {
      let params = new HttpParams();

      params = params.set('fechaInicio', fechaInicio);
      params = params.set('fechaFin', fechaFin);

      const respuesta = await firstValueFrom(this.http.get(`${environment.apiURL}/estadisticas/comentarios-por-tiempo`, {params}));

      return respuesta
    } catch (error) {
      throw new Error(`No se pudieron cargar los comentarios, ${error}`);
    }
  }
  
  async getComentariosByPublicacion(fechaInicio: string, fechaFin: string){
    try {
      let params = new HttpParams();

      params = params.set('fechaInicio', fechaInicio);
      params = params.set('fechaFin', fechaFin);

      const respuesta = await firstValueFrom(this.http.get(`${environment.apiURL}/estadisticas/comentarios-por-publicacion`, {params}));

      return respuesta

    } catch (error) {
      throw new Error(`No se pudieron cargar los comentarios, ${error}`);
    }
  }
}
