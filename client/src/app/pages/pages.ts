import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-pages',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './pages.html',
  styleUrl: './pages.css',
})
export class Pages {
  userS = inject(UserService);

  nombreUsuario = this.userS.getUsuarioLogueado()?.nombre_usuario;

  authS = inject(AuthService);

  router = inject(Router);

  cargando = signal(true);

  async ngOnInit(){
    const token = localStorage.getItem('token');
    
    if(!token){
        this.router.navigate(['/auth/login']);
        return;
    }
    
    try {

        await this.authS.autorizar(token);
        this.cargando.set(false);

    } catch(error){

        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
        
    }
  }

  onCerrarSesion(){
    this.authS.cerrarSesion();
  }

  
}
