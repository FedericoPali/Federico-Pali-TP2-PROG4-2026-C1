import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsuariosModule, JwtModule.register({
    global: true, secret: 'clave_secreta', signOptions: {expiresIn: "15m"}
  })],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
