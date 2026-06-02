import { Body, Controller, Post } from '@nestjs/common';
import { LoginUsuarioDto } from 'src/usuarios/dto/login-usuario.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    
    constructor(private readonly authService: AuthService) {}
    
    @Post('/login')
      login(@Body() loginUsuarioDto: LoginUsuarioDto) {
        return this.authService.login(loginUsuarioDto);
      }
}
