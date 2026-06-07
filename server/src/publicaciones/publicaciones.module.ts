import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicaciones, PublicacionesSchema } from './entities/publicaciones.entity';
import { AuthModule } from '../auth/auth.module';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { Comentario, ComentarioSchema } from './entities/comentario.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Publicaciones.name, schema: PublicacionesSchema },
      {name: Comentario.name, schema: ComentarioSchema}
    ]),
    AuthModule,
    CloudinaryModule
  ],
  controllers: [PublicacionesController, ComentariosController],
  providers: [PublicacionesService, ComentariosService],
})
export class PublicacionesModule {}