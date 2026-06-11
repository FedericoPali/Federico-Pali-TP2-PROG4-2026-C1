import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(private usuariosService: UsuariosService, private jwtService: JwtService) {}

    async login(loginUsuarioDto: LoginUsuarioDto) {
      const usuario = await this.usuariosService.buscarByEmailOUser(loginUsuarioDto.identificador)
        
      if (!usuario) {
        throw new NotFoundException('Los datos no coinciden'); // no especificamos si el error es por el username o por la contrasena para no dar pistas al que intenta ingresar.
      }
        
      if(!usuario.es_activo){
        throw new NotFoundException('Usuario inactivo');
      }
    
    
      const escontrasenaValida = await bcrypt.compare(loginUsuarioDto.contrasena, usuario.contrasena); // comparamos la contraseña ingresada con la de nuestra base de datos luego de asegurarnos que el usuario o email es correcto con compare de bcrypt. Esto devuelve un boolean, de esta forma si es false da el mismo error, caso contrario devuelve el usuario y permitimos el ingreso.
    
      if (!escontrasenaValida) {
        throw new NotFoundException('Los datos no coinciden');
      }

      const payload = {
        sub: usuario?._id,
        nombre_usuario: usuario?.nombre_usuario,
        es_admin: usuario?.es_admin
      }

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    
    async autorizar(payload){
        const nombre_usuario = payload.nombre_usuario

        const usuario = await this.usuariosService.buscarByEmailOUser(nombre_usuario);

        return usuario;
    }

    async refrescar(payload){
      const payloadNuevo = {
        sub: payload?.sub,
        nombre_usuario: payload?.nombre_usuario,
        es_admin: payload?.es_admin
      }
      return {
        access_token: await this.jwtService.signAsync(payloadNuevo),
      };
    }

}
