import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  authS = inject(AuthService)
  router = inject(Router)

  cargando = signal<boolean>(false);
  mensajeError = signal<string | null>(null);

  formulario = new FormGroup({
    email_username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)])
  })



  async action(){
    try{
      this.cargando.set(true);
      const respuesta = await this.authS.loginUsuario(this.formulario.value.email_username!, this.formulario.value.password!)
      console.log("inicio de sesion correcto", respuesta);
      this.router.navigateByUrl("/publicaciones")
      this.cargando.set(false);
    } catch(e){
      console.error(e);
      this.mensajeError.set((e as Error).message);
      this.cargando.set(false);
    }
  }
}
