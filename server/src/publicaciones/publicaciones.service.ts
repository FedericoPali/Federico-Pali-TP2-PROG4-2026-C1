import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from './entities/publicaciones.entity';
import { Model } from 'mongoose';

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
    const publicacion = await this.publicacionesModel.findById(id).exec();

    if (!publicacion) {
      throw new NotFoundException('Publicacion inexistente');
    }
    return publicacion;
  }

  async update(id: string, updatePublicacionesDto: UpdatePublicacionesDto) {
        const publicacion = await this.findOne(id);
    
        const usuarioUpdate = await this.publicacionesModel.findByIdAndUpdate(publicacion._id, updatePublicacionesDto, { new: true }).exec();
    
        return usuarioUpdate;
  }

  async remove(id: string) {
    const publicacion = await this.findOne(id);

    return this.publicacionesModel.findByIdAndUpdate(publicacion._id, { es_activo: false }, { new: true }).exec();
  }
}
