import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publi, PubliServices } from '../../services/publi.service';
import { Comentario, ComentariosService } from '../../services/comentarios.service';
import { PubliCard } from '../../components/publi-card/publi-card';
import { PubliModal } from '../../components/publi-modal/publi-modal';
import { ComentarioCard } from '../../components/comentario-card/comentario-card';
import { ComentarioModal } from '../../components/comentario-modal/comentario-modal';

@Component({
  selector: 'app-publicacion',
  imports: [PubliCard, PubliModal, ComentarioCard, ComentarioModal],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {
  router = inject(Router);

  ruta = inject(ActivatedRoute);

  idPubli = "";

  limite = 3;

  publi = signal<Publi | null>(null);

  listaComentarios = signal<Comentario[]>([]);

  comentarioService = inject(ComentariosService);

  publiService = inject(PubliServices);

  esModalPubli = signal(false);

  esModalComent = signal(false);

  comentarioAEditar = signal<Comentario | null>(null);;

  async cargarPublicacion() {
    if(this.idPubli !== null){
      const publicacion = await this.publiService.getPublicacionById(this.idPubli);
      return publicacion
    }

    throw new Error("Error al cargar la publicacion")
  }

  async cargarComentarios(){
    const comentarios = await this.comentarioService.getComentarios(this.idPubli, this.limite, 0)
    this.limite += this.limite;
    this.listaComentarios.set(comentarios);
    return comentarios;
  }

  async manejarLike(id: string){
    try {
      const data = await this.publiService.postLike(id)

      if(this.publi !== null){
        this.publi.set(data);

      }
    } catch (error) {
      console.error("Error al intentar dar like a la publicacion", error);
    }
  }

  async manejarBorrar(id: string){
    try {
      await this.publiService.deletePublicacion(id);

      this.router.navigate(['/pages/publicaciones']);
    } catch (error) {
      console.error("Error al intentar borrar la publicacion", error);
      
    }
  }

  async manejarBorrarComent(id: string){
    try {
      await this.comentarioService.deleteComentario(this.idPubli, id)

      const comentarios = await this.cargarComentarios();
      this.listaComentarios.set(comentarios);
      this.publi.update((publiActual) => {
        if(publiActual !== null) {
          return {
            ...publiActual,
            cantidadComentarios: (publiActual.cantidadComentarios ?? 1) - 1 
          };
        }
        return null;
      });
    } catch (error) {
      console.error("Error al intentar borrar el comentario", error);
      
    }
  }

  async manejarInicioComentar(){
    try {
      this.esModalComent.set(true);
    } catch (error) {
      console.error("No se pudo abrir el modal para comentar", error);
      
    }
  }

  async manejarInicioDeEdicionPublicacion(){
    try {

      if(this.idPubli !== undefined){
        this.esModalPubli.set(true)
      }

    } catch (error) {
      console.error("No pudimos iniciar la edicion para la publicacion", error);
      
    }
  }

  async manejarInicioDeEdicionComentario(id:string) {
    try {
      const comentario = await this.comentarioService.getComentarioById(this.idPubli, id);

      if(comentario !== undefined){
        this.comentarioAEditar.set(comentario);
        this.esModalComent.set(true);
      }

    } catch (error) {
      console.error("No se pudo editar el comentario", error)
    }
  }

  async manejarGuardadoPublicacion(data: FormData){
    try {
      if(this.publi()){

        const publiActualizada = await this.publiService.patchPublicacion(this.publi()!._id, data)
        this.publi.set(publiActualizada);
      }

      this.cargarPublicacion();
      this.esModalPubli.set(false);
    } catch (error) {
      console.error("Error al intentar guardar cambios publicacion", error);
      
    }
  }

  async manejarGuardadoComentario(contenido: string){
    try {
      const comentarioActual = this.comentarioAEditar();

      if(comentarioActual){
        await this.comentarioService.patchComentario(this.idPubli, comentarioActual._id, contenido);
      } else {
        await this.comentarioService.postComentario(this.idPubli, contenido);
      }

      this.comentarioAEditar.set(null);
      this.cargarComentarios();
      this.esModalComent.set(false);
    } catch (error) {
      console.error("Error al intentar guardar cambios comentario", error);
    }
  }

  async ngOnInit(){
    this.idPubli = this.ruta.snapshot.params['id']; // ActivatedRoute me permite agarrar los datos de los params utilizados en la url, de esta forma ya obtengo el nombre de usuario y puedo realizar la busqueda con mayor facilidad
    const publicacion = await this.cargarPublicacion();
    const comentarios = await this.cargarComentarios();

    this.publi.set(publicacion);

    this.listaComentarios.set(comentarios);
  }
}
