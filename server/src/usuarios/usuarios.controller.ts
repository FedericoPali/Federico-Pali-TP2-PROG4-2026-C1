import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('/crear')
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
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
