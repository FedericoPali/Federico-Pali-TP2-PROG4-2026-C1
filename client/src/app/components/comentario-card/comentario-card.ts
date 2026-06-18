import { Component, inject, input, output, signal } from '@angular/core';
import { Comentario } from '../../services/comentarios.service';
import { UserService } from '../../services/user.service';
import { FiltroPalabrasPipe } from '../../pipes/filtro-palabras-pipe';
import { MencionResaltadaPipe } from '../../pipes/mencion-resaltada-pipe';

@Component({
  selector: 'app-comentario-card',
  imports: [FiltroPalabrasPipe, MencionResaltadaPipe],
  templateUrl: './comentario-card.html',
  styleUrl: './comentario-card.css',
})
export class ComentarioCard {
  userS = inject(UserService);

  comentario = input.required<Comentario>();

  mostrarMenu = signal<boolean>(false);

  idUsuarioLogueado = "";

  onDelete = output<string>();
  onEdit = output<string>();

  toggleMenu(){
    this.mostrarMenu.update(value => !value)
    console.log(this.mostrarMenu());
  };

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
}
