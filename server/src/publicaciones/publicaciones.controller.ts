import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  create(@Body() createPublicacionesDto: CreatePublicacionesDto, @Req() peticion: any, @UploadedFile() archivo) {
    const idCreador = peticion.usuario.sub;
    return this.publicacionesService.create(createPublicacionesDto, idCreador, archivo);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Query('idCreador') idCreador?: string, @Query('limite') limite?: string, @Query('salto') salto?: string, @Query('orden') orden?: string) {
    return this.publicacionesService.findAll(idCreador, limite, salto, orden);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(id);
  }
  
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicacionesDto: UpdatePublicacionesDto) {
    return this.publicacionesService.update(id, updatePublicacionesDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionesService.remove(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/like')
  switchLike(@Param('id') idPublicacion: string, @Req() peticion: any){
    const idUser = peticion.usuario.sub;
    return this.publicacionesService.switchLike(idPublicacion, idUser);
  }
}
