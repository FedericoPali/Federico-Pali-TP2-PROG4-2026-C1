import { Component, input, output, signal } from '@angular/core';
import { Publi } from '../../services/publi.service';

@Component({
  selector: 'app-publi-modal',
  imports: [],
  templateUrl: './publi-modal.html',
  styleUrl: './publi-modal.css',
})
export class PubliModal {
  tituloTemporal = signal("");

  descripcionTemporal = signal("");

  archivoSeleccionado: File | null = null;

  publi = input<Publi | null>(null);

  cerrar = output<void>();

  guardar = output<FormData>();

  emitirGuardado(titulo: string, descripcion: string) {
    const datos = new FormData();
    if(titulo) datos.append('titulo', titulo);
    if(descripcion) datos.append('descripcion', descripcion);
    if(this.archivoSeleccionado) datos.append('archivo', this.archivoSeleccionado);
    this.guardar.emit(datos);
  }
  
  onArchivoSeleccionado(event: any){
    this.archivoSeleccionado = event.target.files[0]
  }
  
}
