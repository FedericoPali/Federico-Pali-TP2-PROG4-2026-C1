import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';

@Controller('publicaciones/:idPublicacion/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Param('idPublicacion') idPublicacion: string, 
    @Body() createComentarioDto: CreateComentarioDto, 
    @Req() peticion: any) {
    const idCreador = peticion.usuario.sub
    return this.comentariosService.create(createComentarioDto, idCreador, idPublicacion);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Param('idPublicacion') idPublicacion: string, @Query('limite') limite?: string, @Query('salto') salto?: string) {
    return this.comentariosService.findAll(idPublicacion, limite, salto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comentariosService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComentarioDto: UpdateComentarioDto) {
    return this.comentariosService.update(id, updateComentarioDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comentariosService.remove(id);
  }
}
