import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';

@Module({
  imports: [
    // Esto carga las variables de tu archivo .env
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que las variables de entorno estén disponibles en toda la aplicación
    }),

    MongooseModule.forRoot(process.env.MONGO_URI as string),

    UsuariosModule,

    PublicacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
