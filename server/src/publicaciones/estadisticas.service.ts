import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from './entities/publicaciones.entity';
import { Comentario } from './entities/comentario.entity';
import { Model } from 'mongoose';

@Injectable()
export class EstadisticasService {
    constructor(
    @InjectModel(Publicaciones.name) private publicacionesModel: Model<Publicaciones>,
    @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>
    ) {}


    async publicacionesPorUsuario(fechaInicio: string, fechaFin: string) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setUTCHours(23, 59, 59, 999); // lo seteamos para que si queremos buscar algo en el mismo dia, tome hasta el fin del mismo, a las 23:59 hs
        
        return await this.publicacionesModel.aggregate([
            { $match: { es_activo: true, createdAt: { $gte: inicio, $lte: fin } } },
            { $group: { _id: "$creador", cantidad: { $sum: 1 } } },
            { $lookup: { from: 'usuarios', localField: '_id', foreignField: '_id', as: 'usuario' } },
            { $unwind: "$usuario" },
            { $project: { nombre_usuario: "$usuario.nombre_usuario", cantidad: 1 } }
        ]);
    }

    async comentariosPorTiempo(fechaInicio: string, fechaFin: string) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setUTCHours(23, 59, 59, 999); // lo seteamos para que si queremos buscar algo en el mismo dia, tome hasta el fin del mismo, a las 23:59 hs
        
        return await this.comentarioModel.aggregate([
            { $match: { es_activo: true, createdAt: { $gte: inicio, $lte: fin } } },
            { $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                cantidad: { $sum: 1 } 
            }},
            { $project: { fecha: "$_id", cantidad: 1, _id: 0 } },
            { $sort: { fecha: 1 } }
        ]);
    }

    async comentariosPorPublicacion(fechaInicio: string, fechaFin: string) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setUTCHours(23, 59, 59, 999); // lo seteamos para que si queremos buscar algo en el mismo dia, tome hasta el fin del mismo, a las 23:59 hs
        
        return await this.comentarioModel.aggregate([
            { $match: { es_activo: true, createdAt: { $gte: inicio, $lte: fin } } },
            { $group: { _id: "$publicacionId", cantidad: { $sum: 1 } } },
            { $lookup: { from: 'publicaciones', localField: '_id', foreignField: '_id', as: 'publicacion' } },
            { $unwind: "$publicacion" },
            { $project: { titulo: "$publicacion.titulo", cantidad: 1, _id: 0 } },
            { $sort: { cantidad: -1 } }
        ]);
    }

}
