import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { SesionModal } from './components/sesion-modal/sesion-modal';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SesionModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');

  authS = inject(AuthService);

  manejarExtension() {
    this.authS.extenderSesion(); 
  }

  manejarCierre() {
    this.authS.cerrarSesion();
  }

  ngOnInit() {
    console.log(environment.apiURL);
  }
}
