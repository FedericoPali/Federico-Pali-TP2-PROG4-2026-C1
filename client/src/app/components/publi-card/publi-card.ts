import { Component, inject, input, output, signal } from '@angular/core';
import { Publi } from '../../services/publi.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HaceCuantoPipe } from '../../pipes/hace-cuanto-pipe';
import { FiltroPalabrasPipe } from '../../pipes/filtro-palabras-pipe';
import { MencionResaltadaPipe } from '../../pipes/mencion-resaltada-pipe';
import { LatidoLikeDirective } from '../../directivas/latido-like';
import { ImagenFallbackDirective } from '../../directivas/imagen-fallback';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-publi-card',
  imports: [HaceCuantoPipe, FiltroPalabrasPipe, MencionResaltadaPipe, LatidoLikeDirective, ImagenFallbackDirective],
  templateUrl: './publi-card.html',
  styleUrl: './publi-card.css',
})
export class PubliCard {
  userS = inject(UserService);

  sanitizer = inject(DomSanitizer);

  publi = input.required<Publi>();

  mostrarMenu = signal<boolean>(false);

  esAdmin = this.userS.getUsuarioLogueado()?.es_admin;

  idUsuarioLogueado = "";

  onLike = output<string>();
  onComent = output<string>();
  onDelete = output<string>();
  onEdit = output<string>();

  router = inject(Router);

  toggleMenu(){
    this.mostrarMenu.update(value => !value)
    console.log(this.mostrarMenu());
  };

  emitirLike(id: string){
    this.onLike.emit(id);
  }

  emitirComentar(id: string){
    this.onComent.emit(id);
  }

  ngOnInit(){
    const datosUsuarioLogueado = this.userS.getUsuarioLogueado();
    this.idUsuarioLogueado = datosUsuarioLogueado.sub
  }


  emitirBorrar(id: string){
    this.onDelete.emit(id)
    this.mostrarMenu.set(false);
  }

  emitirEditar(id: string){
    this.onEdit.emit(id)
    this.mostrarMenu.set(false);
  }

  irAPublicacion(){
    this.router.navigate(['/pages/publicaciones', this.publi()._id]);
  }

  verificarSiLeDiLike(): boolean {
    const meGustas = this.publi().me_gustas;
    if (!meGustas || !this.idUsuarioLogueado) return false;

    return meGustas.some((like: any) => 
      like === this.idUsuarioLogueado || like._id === this.idUsuarioLogueado
    );
  }

  sanitizar(texto: string) {
    return this.sanitizer.bypassSecurityTrustHtml(texto);
  }
}
