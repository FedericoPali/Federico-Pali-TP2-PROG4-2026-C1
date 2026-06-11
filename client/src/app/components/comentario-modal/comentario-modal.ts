import { Component, input, output, signal } from '@angular/core';
import { Comentario } from '../../services/comentarios.service';

@Component({
  selector: 'app-comentario-modal',
  imports: [],
  templateUrl: './comentario-modal.html',
  styleUrl: './comentario-modal.css',
})
export class ComentarioModal {
  contenidoTemporal = signal("");

  comentario = input<Comentario | null>(null);

  cerrar = output<void>();

  guardar = output<string>();

  emitirGuardado(contenido: string) {
    this.guardar.emit(contenido);
  }

  ngOnInit(){
    this.contenidoTemporal.set(this.comentario()?.contenido ?? '');
  }
}
