import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario } from './entities/comentario.entity';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ComentariosService {

  constructor(
    @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>
  ) {}

  async create(createComentarioDto: CreateComentarioDto, creadorId: string, idPublicacion: string) {

    const nuevoComentario = new this.comentarioModel({
      contenido: createComentarioDto.contenido,
      creador: new mongoose.Types.ObjectId(creadorId),
      publicacionId: new mongoose.Types.ObjectId(idPublicacion)
    });

    await nuevoComentario.save();

    return nuevoComentario;

  }

  async findAll(idPublicacion: string, limite?: string, salto?: string) {

    const limiteInt = limite ? parseInt(limite, 10) : 5 // si el front nos envia un limite de cuantos comentarios quiere, lo parseamos a numero decimal y sino por default enviamos 5
    const saltoInt = salto ? parseInt(salto, 10) : 0 // si el front nos envia un salto de cuantos comentarios quiere saltear, lo parseamos a numero decimal y sino por default no realizamos ningun salto

    const comentarios = await this.comentarioModel.find({publicacionId: idPublicacion, es_activo: true}).populate('creador', 'nombre_usuario es_activo')
    .sort({createdAt: -1})
    .skip(saltoInt)
    .limit(limiteInt)
    .exec(); // busca cada comentario de la publicacion seleccionada, luego los sortea del mas reciente al mas viejo

    return comentarios.filter(c => (c.creador as any).es_activo !== false);
  }

  async findOne(id: string) {
    const comentario = await this.comentarioModel.findOne({_id: id, es_activo: true}).populate('creador', 'nombre_usuario').exec();

    if(!comentario){
      throw new NotFoundException('No se encontro el comentario')
    }

    return comentario
  }

  async update(id: string, updateComentarioDto: UpdateComentarioDto) {
    const comentario = await this.findOne(id);

    const comentarioUpdate = await this.comentarioModel.findByIdAndUpdate(comentario._id, {...updateComentarioDto, modificado: true}, { new: true }).exec();

    return comentarioUpdate;
  }

  async remove(id: string) {
    const comentario = await this.findOne(id);

    return await this.comentarioModel.findByIdAndUpdate(comentario._id, { es_activo: false }, { new: true }).exec(); 
  }

  async removeByPublicacion(idPublicacion: string){
    return await this.comentarioModel.updateMany({publicacionId: idPublicacion}, {es_activo: false})
  }
}
