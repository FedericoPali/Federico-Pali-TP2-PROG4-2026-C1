import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { PubliCard } from '../../components/publi-card/publi-card';
import { Publi, PubliServices } from '../../services/publi.service';
import { PubliModal } from '../../components/publi-modal/publi-modal';

@Component({
  selector: 'app-mi-perfil',
  imports: [PubliCard, PubliModal],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {
  ruta = inject(ActivatedRoute)

  userS = inject(UserService);

  publiService = inject(PubliServices);

  listaPublicaciones = signal<Publi[]>([]);

  usuario = signal<User | null>(null);

  esModal = signal(false);

  publiAEditar = signal<Publi | null>(null);

  async cargarPublicaciones() {
    const data = await this.publiService.getPublicaciones("",3,0,this.usuario()?._id)
    this.listaPublicaciones.set(data)
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

  async manejarBorrar(id: string){
    try {
      await this.publiService.deletePublicacion(id)

      this.cargarPublicaciones();
    } catch (error) {
      console.error("Error al intentar borrar la publicacion", error);
      
    }
  }

  async manejarInicioDeEdicion(id: string){
    try {
      const publicacion = await this.publiService.getPublicacionById(id);

      if(publicacion !== undefined){
        this.publiAEditar.set(publicacion);
        this.esModal.set(true)
      }

    } catch (error) {
      console.error("No pudimos iniciar la edicion para la publicacion", error);
      
    }
  }

  async manejarGuardado(data: FormData){
    try {
      const publiActual = this.publiAEditar();

      if(publiActual){
        await this.publiService.patchPublicacion(publiActual._id, data)
      }

      this.publiAEditar.set(null);
      this.cargarPublicaciones();
      this.esModal.set(false);
    } catch (error) {
      console.error("Error al intentar guardar cambios", error);
      
    }
  }

  async manejarCreacion(datos: FormData){
    try {
      const data = await this.publiService.postPublicacion(datos)

      await this.cargarPublicaciones()
      console.log("Post creado", data);
    } catch (error) {
      console.error("Error al intentar postear la publicacion", error);
    }
  }

  async ngOnInit(){
    const nombreUsuario = this.ruta.snapshot.params['username']; // ActivatedRoute me permite agarrar los datos de los params utilizados en la url, de esta forma ya obtengo el nombre de usuario y puedo realizar la busqueda con mayor facilidad
    const dataUsuario = await this.userS.getUsuarioByUsername(nombreUsuario)
    this.usuario.set(dataUsuario);
    await this.cargarPublicaciones();
  }
}
