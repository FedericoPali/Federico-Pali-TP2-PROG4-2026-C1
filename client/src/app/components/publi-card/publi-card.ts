import { Component, inject, input, output, signal } from '@angular/core';
import { Publi } from '../../services/publi.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publi-card',
  imports: [],
  templateUrl: './publi-card.html',
  styleUrl: './publi-card.css',
})
export class PubliCard {
  userS = inject(UserService);

  publi = input.required<Publi>();

  mostrarMenu = signal<boolean>(false);

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
}
