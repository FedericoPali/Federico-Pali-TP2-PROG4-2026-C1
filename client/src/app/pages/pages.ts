import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-pages',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './pages.html',
  styleUrl: './pages.css',
})
export class Pages {
  userS = inject(UserService);
  nombreUsuario = this.userS.getUsuarioLogueado()?.nombre_usuario;
}
