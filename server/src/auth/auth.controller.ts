import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
    
    constructor(private readonly authService: AuthService) {}
    
    @Post('/login')
      login(@Body() loginUsuarioDto: LoginUsuarioDto) {
        return this.authService.login(loginUsuarioDto);
    }

    @UseGuards(JwtGuard)
    @Post('/autorizar')
      autorizar(@Req() peticion: any) {
        return this.authService.autorizar(peticion.usuario);
    }    
    
    @UseGuards(JwtGuard)
    @Post('/refrescar')
      refrescar(@Req() peticion: any) {
        return this.authService.refrescar(peticion.usuario);
    }
}
