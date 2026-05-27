import { Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    
  ) {}

  async login(loginUsuarioDto: LoginUsuarioDto) {
    const usuario = await this.usuarioModel.findOne({ $or: [{ nombre_usuario: loginUsuarioDto.identificador }, { email: loginUsuarioDto.identificador }] }).exec(); // utilizamos el $or porque el usuario puede iniciar sesion tanto con el username como con el email, dependiendo que ingresa el usuario en el POST es lo que se busca en la base de datos.
    
    if (!usuario) {
      throw new NotFoundException('Los datos no coinciden'); // no especificamos si el error es por el username o por la contraseña para no dar pistas al que intenta ingresar.
    }
    
    if(!usuario.es_activo){
      throw new NotFoundException('Usuario inactivo');
    }


    const esContraseñaValida = await bcrypt.compare(loginUsuarioDto.contraseña, usuario.contraseña); // comparamos la contraseña ingresada con la de nuestra base de datos luego de asegurarnos que el usuario o email es correcto con compare de bcrypt. Esto devuelve un boolean, de esta forma si es false da el mismo error, caso contrario devuelve el usuario y permitimos el ingreso.

    if (!esContraseñaValida) {
      throw new NotFoundException('Los datos no coinciden');
    }

    const usuarioLimpio = await this.usuarioModel.findById(usuario._id).select('-contraseña').exec(); // para no devolver la contraseña en el login, buscamos el usuario por id y utilizamos select para excluir la contraseña del resultado.

    return usuarioLimpio;
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const contraseñaHash = await bcrypt.hash(createUsuarioDto.contraseña, 10);

    createUsuarioDto.contraseña = contraseñaHash;

    const usuarioCreado = await this.usuarioModel.create(createUsuarioDto);
    
    return usuarioCreado;
  }

  async findAll() {
    const usuarios = await this.usuarioModel.find({ es_activo: true }).exec();
    return usuarios;
  }

  async findOne(username: string) {
    const usuario = await this.usuarioModel.findOne({ nombre_usuario: username }).exec();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async update(username: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioModel.findOne({ nombre_usuario: username }).exec();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateUsuarioDto.contraseña) { // en caso de que se quiera actualizar la contraseña, la hasheamos y la guardamos en el DTO para que luego en el findByIdAndUpdate se actualice correctamente. Si en el DTO no hay contraseña pasa de largo.
      const contraseñaHash = await bcrypt.hash(updateUsuarioDto.contraseña, 10);
      updateUsuarioDto.contraseña = contraseñaHash;
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
    const usuario = await this.usuarioModel.findOne({ nombre_usuario: username }).exec();
    
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.usuarioModel.findByIdAndUpdate(usuario._id, { es_activo: false }, { new: true }).exec();
  }

  // utilice el nombre de usuario como identificador unico para las operaciones pq es un campo unico y es mas facil de manejarse que con el id generado por MongoDB y asi el usuario solo debe ingresar el username para realizar las distintas operaciones. Igualmente dentro utilizamos el id para las operaciones, asi nos aseguramos de que estamos manejando el usuario correcto.
}
