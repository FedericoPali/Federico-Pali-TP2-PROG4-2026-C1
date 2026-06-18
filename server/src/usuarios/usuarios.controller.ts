import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/guards/admin/admin.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('/crear')
  @UseInterceptors(FileInterceptor('archivo'))
  create(@Body() createUsuarioDto: CreateUsuarioDto, @UploadedFile() archivo) {
    return this.usuariosService.create(createUsuarioDto, archivo);
  }
  
  @UseGuards(AdminGuard)
  @Post('/crearPorAdmin')
  @UseInterceptors(FileInterceptor('archivo'))
  createByAdmin(@Body() createUsuarioDto: CreateUsuarioDto, @UploadedFile() archivo) {
    return this.usuariosService.create(createUsuarioDto, archivo);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.usuariosService.findAllParaAdmin();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usuariosService.findOne(username);
  }

  @Patch(':username')
  update(@Param('username') username: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(username, updateUsuarioDto);
  }

  @UseGuards(AdminGuard)
  @Post('/rehabilitar/:username')
  rehabilitar(@Param('username') username: string) {
    return this.usuariosService.rehabilitar(username);
  }

  @UseGuards(AdminGuard)
  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.usuariosService.remove(username);
  }
}
