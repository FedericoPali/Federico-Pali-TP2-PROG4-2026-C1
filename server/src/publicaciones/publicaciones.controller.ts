import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createPublicacionesDto: CreatePublicacionesDto, @Req() peticion: any) {
    const idCreador = peticion.usuario.sub;
    return this.publicacionesService.create(createPublicacionesDto, idCreador);
  }

  @Get()
  findAll() {
    return this.publicacionesService.findAll();
  }

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
}
