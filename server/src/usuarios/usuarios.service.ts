import { Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    private cloudinaryService: CloudinaryService
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto, archivo?: any) {
    const usuarioExistente = await this.usuarioModel.findOne({ $or: [{ nombre_usuario: createUsuarioDto.nombre_usuario }, { email: createUsuarioDto.email }] }).exec();
    
    if(usuarioExistente){
      if (usuarioExistente.email === createUsuarioDto.email) {
        throw new ConflictException('El email ya está registrado');
      }
    
      if (usuarioExistente.nombre_usuario === createUsuarioDto.nombre_usuario) {
          throw new ConflictException('El nombre de usuario ya está en uso');
      }
    }
    
    if(archivo) {
      const urlImgPerfil = await this.cloudinaryService.subirImagen(archivo, "red_social/perfil")
      createUsuarioDto.imagen_perfil = urlImgPerfil;

    }


    const contrasenaHash = await bcrypt.hash(createUsuarioDto.contrasena, 10);

    createUsuarioDto.contrasena = contrasenaHash;

    console.log("Datos recibidos en el backend:", createUsuarioDto);
    const usuarioCreado = await this.usuarioModel.create(createUsuarioDto);
    
    return usuarioCreado;
  }

  async findAll() {
    const usuarios = await this.usuarioModel.find({ es_activo: true }).exec();
    return usuarios;
  }

  async findOne(username: string) {
    const usuario = await this.usuarioModel.findOne({ nombre_usuario: username, es_activo: true }).exec();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async update(username: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(username);

    if (updateUsuarioDto.contrasena) { // en caso de que se quiera actualizar la contrasena, la hasheamos y la guardamos en el DTO para que luego en el findByIdAndUpdate se actualice correctamente. Si en el DTO no hay contrasena pasa de largo.
      const contrasenaHash = await bcrypt.hash(updateUsuarioDto.contrasena, 10);
      updateUsuarioDto.contrasena = contrasenaHash;
    }

    if (updateUsuarioDto.nombre_usuario) { // en caso de que se quiera actualizar el nombre de usuario, verificamos que no exista otro usuario con ese nombre en nuestra base de datos, si existe, verificamos que no se trate del mismo usuario que estamos actualizando, en caso de ser otro lanzamos un error de que el usuario ya esta registrado.
      const usuarioExistente = await this.usuarioModel.findOne({ nombre_usuario: updateUsuarioDto.nombre_usuario }).exec();
      if (usuarioExistente && usuarioExistente._id.toString() !== usuario._id.toString()) {
        throw new ConflictException('Nombre de usuario ya existe');
      }
    }

    const usuarioUpdate = await this.usuarioModel.findByIdAndUpdate(usuario._id, updateUsuarioDto, { new: true }).exec();

    return usuarioUpdate;
  }

  async remove(username: string) {
    const usuario = await this.findOne(username);

    return this.usuarioModel.findByIdAndUpdate(usuario._id, { es_activo: false }, { new: true }).exec();
  }

  async buscarByEmailOUser(identificador: string){
    const usuario = await this.usuarioModel.findOne({ $or: [{ nombre_usuario: identificador }, { email: identificador }] }).exec(); // utilizamos el $or porque el usuario puede iniciar sesion tanto con el username como con el email, dependiendo que ingresa el usuario en el POST es lo que se busca en la base de datos.
    
    return usuario;
  }

  // utilice el nombre de usuario como identificador unico para las operaciones pq es un campo unico y es mas facil de manejarse que con el id generado por MongoDB y asi el usuario solo debe ingresar el username para realizar las distintas operaciones. Igualmente dentro utilizamos el id para las operaciones, asi nos aseguramos de que estamos manejando el usuario correcto.
}
