import { Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-publi-form',
  imports: [ReactiveFormsModule],
  templateUrl: './publi-form.html',
  styleUrl: './publi-form.css',
})
export class PubliForm {


  cargando = signal<boolean>(false);
  mensajeError = signal<string | null>(null);
  archivoSeleccionado: File | null = null;

  onCrear = output<FormData>();

  publiForm = new FormGroup({
    titulo: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    descripcion: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
  })

  onArchivoSeleccionado(event: any){
    this.archivoSeleccionado = event.target.files[0]
  }


  action(){
      const data = this.publiForm.value

      if(data.titulo && data.descripcion){
        const datos = new FormData();

        datos.append('titulo', this.publiForm.value.titulo!)
        datos.append('descripcion', this.publiForm.value.descripcion!)

        if(this.archivoSeleccionado){
          datos.append('archivo', this.archivoSeleccionado)
        }

        this.onCrear.emit(datos);

        this.publiForm.reset();
      }
  }
}
