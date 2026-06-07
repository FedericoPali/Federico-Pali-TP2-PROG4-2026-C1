import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('/crear')
  @UseInterceptors(FileInterceptor('archivo'))
  create(@Body() createUsuarioDto: CreateUsuarioDto, @UploadedFile() archivo) {
    return this.usuariosService.create(createUsuarioDto, archivo);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usuariosService.findOne(username);
  }

  @Patch(':username')
  update(@Param('username') username: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(username, updateUsuarioDto);
  }

  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.usuariosService.remove(username);
  }
}
