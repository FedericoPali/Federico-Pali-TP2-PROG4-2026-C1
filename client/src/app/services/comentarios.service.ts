import { Injectable } from '@angular/core';

export interface Comentario {
  _id: string,
  contenido: string,
  creador: {
    _id: string,
    nombre_usuario: string
  }
  publicacionId: string,
  es_activo: boolean,
  modificaco: boolean,
}

@Injectable({
  providedIn: 'root',
})
export class ComentariosService {}
