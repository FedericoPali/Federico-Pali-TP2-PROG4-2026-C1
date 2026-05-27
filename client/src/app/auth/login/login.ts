import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authS = inject(AuthService)

  formulario = new FormGroup({
    email_username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)])
  })



  async action(){
    try{
      const respuesta = await this.authS.loginUsuario(this.formulario.value.email_username!, this.formulario.value.password!)
      console.log("inicio de sesion correcto", respuesta);
    } catch(e){
      console.error("fallo al iniciar sesion", e);
      
    }
  }
}
