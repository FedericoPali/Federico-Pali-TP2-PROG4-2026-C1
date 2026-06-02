import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

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

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }]})
    me_gustas: mongoose.Types.ObjectId[];

    @Prop({type: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }})
    creador: mongoose.Types.ObjectId;
}

export const PublicacionesSchema = SchemaFactory.createForClass(Publicaciones);