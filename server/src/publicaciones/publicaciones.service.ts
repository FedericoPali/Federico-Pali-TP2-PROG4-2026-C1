import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from './entities/publicaciones.entity';
import mongoose, { Model, SortOrder, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PublicacionesService {

  constructor(
    @InjectModel(Publicaciones.name) private publicacionesModel: Model<Publicaciones>,
    private cloudinaryService: CloudinaryService
  ) {}

  async create(createPublicacionesDto: CreatePublicacionesDto, creadorId, archivo?: any) {
    
    console.log("Datos recibidos en el backend:", createPublicacionesDto);

    if(archivo) {
      const urlImgPubli = await this.cloudinaryService.subirImagen(archivo, "red_social/publicaciones")
      createPublicacionesDto.imagen = urlImgPubli;

    }

    const nuevaPublicacion = {...createPublicacionesDto, creador: creadorId}
    
    const publicacionCreada = await this.publicacionesModel.create(nuevaPublicacion)

    return await publicacionCreada.populate([
      { path: 'creador', select: 'nombre_usuario' },
      { path: 'cantidadComentarios' }
    ]);
  }

  async findAll(idCreador?: string, limite?: string, salto?: string, orden?: string) {

    const limiteInt = limite ? parseInt(limite, 10) : 3
    const saltoInt = salto ? parseInt(salto, 10) : 0

    const filtro: {es_activo: boolean, creador?: Types.ObjectId} = {es_activo: true }

    let ordenarPor: {_id?: SortOrder, cantidadLikes?: SortOrder} = {_id: -1}

    if(orden){
      if(orden === "likes"){
        ordenarPor = {cantidadLikes: -1}
      }
    }

    if(idCreador){
      const creadorObjectId = new mongoose.Types.ObjectId(idCreador)
      filtro.creador = creadorObjectId
    }

    const publicaciones = await this.publicacionesModel.find(filtro)
    .sort(ordenarPor)
    .skip(saltoInt)
    .limit(limiteInt)
    .populate('cantidadComentarios').populate('creador', 'nombre_usuario').exec();

    return publicaciones;
  }

  async findOne(id: string) {
    const publicacion = await this.publicacionesModel.findOne({_id: id, es_activo: true}).populate('cantidadComentarios').populate('creador', 'nombre_usuario').exec();

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
      publicacion.cantidadLikes += 1;

    } else {
      publicacion.me_gustas.splice(indexLike, 1);
      publicacion.cantidadLikes -= 1;
    }

    await publicacion.save();

    return publicacion
  }
}
