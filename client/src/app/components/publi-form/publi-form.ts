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

  onCrear = output<{ titulo: string, descripcion: string, imagen?: string }>();

  publiForm = new FormGroup({
    titulo: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    descripcion: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
    imagen: new FormControl("")
  })

  action(){
      const data = this.publiForm.value

      if(data.titulo && data.descripcion){
        const paquete = {
          titulo: data.titulo,
          descripcion: data.descripcion,
          imagen: data.imagen || ''
        }

        this.onCrear.emit(paquete);

        this.publiForm.reset();
      }
  }
}
