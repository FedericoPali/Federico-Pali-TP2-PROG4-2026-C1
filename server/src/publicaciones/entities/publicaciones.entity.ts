import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({ timestamps: true })
export class Publicaciones {
    @Prop({required: true})
    titulo: string

    @Prop({required: true})
    descripcion: string;

    @Prop()
    imagen: string;

    @Prop({default: true})
    es_activo: boolean; 

    @Prop({default: 0})
    cantidadLikes: number;

    @Prop({type: [{type: Types.ObjectId, ref: 'Usuario' }]})
    me_gustas: Types.ObjectId[];

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
    creador: Types.ObjectId;
}

export const PublicacionesSchema = SchemaFactory.createForClass(Publicaciones);

PublicacionesSchema.set('toJSON', { virtuals: true }); // habilitamos que virtuals viaje tanto en los JSON como en los Objects
PublicacionesSchema.set('toObject', { virtuals: true });

PublicacionesSchema.virtual('cantidadComentarios', {
    ref: 'Comentario',
    localField: '_id',
    foreignField: 'publicacionId',
    count: true,
    match: {es_activo: true}
}); // con esto creamos un virtual que genera un campo llamado cantidadComentarios, en el cual se va a almacenar la cantidad de publicacionId en la collection Comentarios que sean iguales a la _id de la publicacion.