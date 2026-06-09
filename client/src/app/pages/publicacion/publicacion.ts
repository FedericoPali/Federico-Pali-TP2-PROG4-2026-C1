import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PubliServices } from '../../services/publi.service';

@Component({
  selector: 'app-publicacion',
  imports: [],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {
  ruta = inject(ActivatedRoute);

  publiService = inject(PubliServices);
  

  async ngOnInit(){
    const idPubli = this.ruta.snapshot.params['id']; // ActivatedRoute me permite agarrar los datos de los params utilizados en la url, de esta forma ya obtengo el nombre de usuario y puedo realizar la busqueda con mayor facilidad
    this.usuario.set(dataUsuario);
    await this.cargarPublicaciones();
  }
}
