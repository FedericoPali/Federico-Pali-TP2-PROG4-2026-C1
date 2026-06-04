import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from './entities/publicaciones.entity';
import mongoose, { Model, Types } from 'mongoose';

@Injectable()
export class PublicacionesService {

  constructor(
    @InjectModel(Publicaciones.name) private publicacionesModel: Model<Publicaciones>
  ) {}

  async create(createPublicacionesDto: CreatePublicacionesDto, creadorId) {
    
    console.log("Datos recibidos en el backend:", createPublicacionesDto);

    const nuevaPublicacion = {...createPublicacionesDto, creador: creadorId}
    
    const publicacionCreada = await this.publicacionesModel.create(nuevaPublicacion)

    return publicacionCreada
  }

  async findAll() {
    const publicaciones = await this.publicacionesModel.find({es_activo: true}).exec();
    return publicaciones;
  }

  async findOne(id: string) {
    const publicacion = await this.publicacionesModel.findOne({_id: id, es_activo: true}).exec();

    if (!publicacion) {
      throw new NotFoundException('Publicacion inexistente');
    }
    return publicacion;
  }

  async update(id: string, updatePublicacionesDto: UpdatePublicacionesDto) {
        const publicacion = await this.findOne(id);
    
        const publicacionUpdate = await this.publicacionesModel.findByIdAndUpdate(publicacion._id, updatePublicacionesDto, { new: true }).exec();
    
        return publicacionUpdate;
  }

  async remove(id: string) {
    const publicacion = await this.findOne(id);

    return await this.publicacionesModel.findByIdAndUpdate(publicacion._id, { es_activo: false }, { new: true }).exec();
  }

  async switchLike(idPublicacion: string, idUser: string){
    const publicacion = await this.findOne(idPublicacion);

    const indexLike = publicacion.me_gustas.findIndex((likeId) => likeId.toString() === idUser);

    if(indexLike === -1){
      const userObjectId = new mongoose.Types.ObjectId(idUser) // como la columna me_gustas de cada publicacion guarda objectId del usuario, convertimos el idUser string traido del JWT a ObjectId y lo pasamos al push()
      publicacion.me_gustas.push(userObjectId);

    } else {
      publicacion.me_gustas.splice(indexLike, 1);
    }

    await publicacion.save();

    return publicacion
  }
}
