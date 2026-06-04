import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema()
export class Publicaciones {
    @Prop({required: true})
    titulo: string

    @Prop({required: true})
    descripcion: string;

    @Prop()
    imagen: string;

    @Prop({default: true})
    es_activo: boolean; 

    @Prop({type: [{type: Types.ObjectId, ref: 'Usuario' }]})
    me_gustas: Types.ObjectId[];

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
    creador: Types.ObjectId;
}

export const PublicacionesSchema = SchemaFactory.createForClass(Publicaciones);