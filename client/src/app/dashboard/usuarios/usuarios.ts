import { Component, computed, inject, signal } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { mayorDeEdadValidator } from '../../validators/edad.validator';
import { ResaltarErrorDirective } from '../../directivas/resaltar-error';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, ResaltarErrorDirective],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  userS = inject(UserService);

  listaUsuarios = signal<User[]>([]);

  cargando = signal<boolean>(false);
  longitudDescripcion = signal(0);
  excedido = computed(() => this.longitudDescripcion() > 80);
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
    descripcion_breve: new FormControl("", [Validators.maxLength(80)]),
    es_admin: new FormControl(false)
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

  async cargarUsuarios(){
    const usuarios = await this.userS.getUsuarios();
    if(usuarios.length > 0){
      this.listaUsuarios.set(usuarios);
    }

  }

  async manejarDeshabilitar(username: string){
    await this.userS.deshabilitarUsuario(username);
    this.cargarUsuarios()
  }

  async manejarRehabilitar(username: string){
    await this.userS.rehabilitarUsuario(username);
    this.cargarUsuarios()
  }

  async crearUsuario(){
    try {
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
      datos.append('es_admin', this.formulario.value.es_admin ? 'true' : 'false');
      await this.userS.crearUsuario(datos);
      this.cargarUsuarios()
      this.formulario.reset()
      this.cargando.set(false);
    } catch (error) {
      console.error(error);
      this.mensajeError.set((error as Error).message);
      this.cargando.set(false);
    }
    
  }

  async ngOnInit(){
      this.cargarUsuarios();
      this.formulario.controls.descripcion_breve.valueChanges.subscribe(valor => {
          this.longitudDescripcion.set(valor?.length || 0);
      });
  }
}
