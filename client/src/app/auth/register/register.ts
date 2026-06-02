import { Component, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
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

  formulario = new FormGroup({
    nombre: new FormControl("", [Validators.required, Validators.minLength(3)]),
    apellido: new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    username: new FormControl("", [Validators.required, Validators.minLength(4)]),
    contraseña: new FormControl("", [Validators.required, Validators.minLength(8)]),
    recontraseña: new FormControl("", [Validators.required, Validators.minLength(8)]),
    fecha_nacimiento: new FormControl("", [Validators.required]),
    descripcion_breve: new FormControl("", [Validators.maxLength(80)])
  },{
    validators: (grupo) => {
      if(grupo.get('contraseña')?.value !== grupo.get('recontraseña')?.value){
        return {noCoinciden: true};
      } else {
        return null;
      }
    }
  })

  async action(){
    try{
      this.cargando.set(true);
      const respuesta = await this.authS.registerUsuario(this.formulario.value.nombre!, this.formulario.value.apellido!, this.formulario.value.email!, this.formulario.value.username!, this.formulario.value.contraseña!, this.formulario.value.fecha_nacimiento!, this.formulario.value.descripcion_breve!)
      console.log("registro exitoso", respuesta);
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
