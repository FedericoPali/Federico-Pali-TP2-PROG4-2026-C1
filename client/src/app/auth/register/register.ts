import { Component, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { mayorDeEdadValidator } from '../../validators/edad.validator';
import { ResaltarErrorDirective } from '../../directivas/resaltar-error';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, ResaltarErrorDirective],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  authS = inject(AuthService)
  router = inject(Router)

  longitudDescripcion = signal(0);
  excedido = computed(() => this.longitudDescripcion() > 80);
  cargando = signal<boolean>(false);
  mensajeError = signal<string | null>(null);
  archivoSeleccionado: File | null = null;

  formulario = new FormGroup({
    nombre: new FormControl("", [Validators.required, Validators.minLength(3)]),
    apellido: new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    username: new FormControl("", [Validators.required, Validators.minLength(4)]),
    contrasena: new FormControl("", [Validators.required, Validators.minLength(8)]),
    recontrasena: new FormControl("", [Validators.required, Validators.minLength(8)]),
    fecha_nacimiento: new FormControl("", [Validators.required, mayorDeEdadValidator]),
    descripcion_breve: new FormControl("", [Validators.maxLength(80)])
  },{
    validators: (grupo) => {
      if(grupo.get('contrasena')?.value !== grupo.get('recontrasena')?.value){
        return {noCoinciden: true};
      } else {
        return null;
      }
    }
  })

  onArchivoSeleccionado(event: any){
    this.archivoSeleccionado = event.target.files[0]
  }

  async action(){
    try{
      this.cargando.set(true);
      const datos = new FormData();
      datos.append('nombre', this.formulario.value.nombre!);
      datos.append('apellido', this.formulario.value.apellido!);
      datos.append('email', this.formulario.value.email!)
      datos.append('nombre_usuario', this.formulario.value.username!)
      datos.append('contrasena', this.formulario.value.contrasena!)
      datos.append('fecha_nacimiento', this.formulario.value.fecha_nacimiento!)
      if(this.archivoSeleccionado) {
          datos.append('archivo', this.archivoSeleccionado);
      }
      if(this.formulario.value.descripcion_breve){
        datos.append('descripcion_breve', this.formulario.value.descripcion_breve);
      }
      await this.authS.registerUsuario(datos);
      console.log("registro exitoso", datos);
      this.router.navigateByUrl("/auth/login")
      this.cargando.set(false);
    } catch(e){
      console.error(e);
      this.mensajeError.set((e as Error).message);
      this.cargando.set(false);
    }
  }

  ngOnInit(){
    this.formulario.controls.descripcion_breve.valueChanges.subscribe(valor => {
    this.longitudDescripcion.set(valor?.length || 0);
    });
  }
}
