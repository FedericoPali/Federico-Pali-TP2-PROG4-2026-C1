import { Component, inject, signal } from '@angular/core';
import { PubliCard } from '../../components/publi-card/publi-card';
import { Publi, PubliServices } from '../../services/publi.service';
import { PubliForm } from '../../components/publi-form/publi-form';

@Component({
  selector: 'app-publicaciones',
  imports: [PubliCard, PubliForm],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {

  publiService = inject(PubliServices);

  listaPublicaciones = signal<Publi[]>([]);

  async ngOnInit() {
    try {
      const data = await this.publiService.getPublicaciones();

      this.listaPublicaciones.set(data)
      console.log("Datos que llegaron al componente:", this.listaPublicaciones);
    } catch (error) {
      console.error("Error al traer publicaciones", error);
    }
  }

  async manejarLike(id: string){
    try {
      const data = await this.publiService.postLike(id)

      this.listaPublicaciones.update((actual) => {
        return actual.map( (publicacion) => {
          if(publicacion._id === id){
            return data
          } else {
            return publicacion
          }
        })
      })
    } catch (error) {
      console.error("Error al intentar dar like a la publicacion", error);
    }
  }

  async manejarCreacion(datos: FormData){
    try {
      const data = await this.publiService.postPublicacion(datos)

      this.listaPublicaciones.update( (actual) => {
        return [data, ...actual];
      })
      console.log("Post creado", data);
    } catch (error) {
      console.error("Error al intentar postear la publicacion", error);
    }
  }
}
