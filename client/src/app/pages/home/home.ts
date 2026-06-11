import { Component, inject, signal } from '@angular/core';
import { PubliCard } from '../../components/publi-card/publi-card';
import { Publi, PubliServices } from '../../services/publi.service';
import { PubliForm } from '../../components/publi-form/publi-form';
import { PubliModal } from '../../components/publi-modal/publi-modal';
import { Comentario, ComentariosService } from '../../services/comentarios.service';
import { ComentarioModal } from '../../components/comentario-modal/comentario-modal';

@Component({
  selector: 'app-publicaciones',
  imports: [PubliCard, PubliForm, PubliModal, ComentarioModal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  comentarioService = inject(ComentariosService);

  publiService = inject(PubliServices);

  listaPublicaciones = signal<Publi[]>([]);

  orden = "";

  salto = 0;

  limite = 3;

  hayMasPaginas = signal(true);

  esModalPubli = signal(false);

  publiAEditar = signal<Publi | null>(null);

  esModalComentario = signal(false);

  idPubliAComentar = signal<string | null>(null);

  async ngOnInit() {
    try {
      await this.cambiarOrden(this.orden)
      console.log("Datos que llegaron al componente:", this.listaPublicaciones);
    } catch (error) {
      console.error("Error al traer publicaciones", error);
    }
  }

  async cambiarOrden(orden: string){
    try {
      this.orden = orden;
      this.hayMasPaginas.set(true);
      this.salto = 0;
      
      await this.cargarPublicaciones()
      console.log("Publicaciones ordenadas por: ", this.orden);
    } catch (error) {
      console.error("Error al ordenar publicaciones", error);
      
    }
  }

  async paginaSiguiente(){
    try {
      this.salto += this.limite;  
      await this.cargarPublicaciones();
      
      console.log("Publicaciones ordenadas por: ", this.orden);

    } catch (error) {
      console.error("Error al pasar pagina", error);
      
    }
  }

  async paginaAnterior(){
    try {
      this.salto -= this.limite;  

      await this.cargarPublicaciones()
      console.log("Publicaciones ordenadas por: ", this.orden);
      
    } catch (error) {
      console.error("Error al pasar pagina", error);

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
        this.esModalPubli.set(true)
      }

    } catch (error) {
      console.error("No pudimos iniciar la edicion para la publicacion", error);
      
    }
  }

  async manejarInicioComentar(idPublicacion: string){
    try {
      this.esModalComentario.set(true);
      this.idPubliAComentar.set(idPublicacion);
    } catch (error) {
      console.error("No se pudo abrir el modal para comentar", error);
      
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
      this.esModalPubli.set(false);
    } catch (error) {
      console.error("Error al intentar guardar cambios", error);
      
    }
  }

  async manejarCreacionComentario(contenido: string){
    try {
      if(contenido !== null){
        if(this.idPubliAComentar() !== null){
          await this.comentarioService.postComentario(this.idPubliAComentar()!, contenido)
          this.esModalComentario.set(false);
          this.cargarPublicaciones();
        }
      }
    } catch (error) {
      
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

  async cargarPublicaciones(){
    try {
      const data = await this.publiService.getPublicaciones(this.orden, this.limite, this.salto);
      
      if(data.length === 0){
        this.salto -= this.limite;
        this.hayMasPaginas.set(false);
        return;
      }
      
      if(data.length < this.limite){
        this.hayMasPaginas.set(false);
      } else {
        this.hayMasPaginas.set(true);

      }

      this.listaPublicaciones.set(data);

      const hayMasDatos = await this.publiService.getPublicaciones(this.orden, this.limite, this.salto + this.limite);
      if(hayMasDatos.length === 0){
        this.hayMasPaginas.set(false);
      }
    } catch (error) {
      console.error("Error cargando Publicaciones", error);
      
    }

  }
}
