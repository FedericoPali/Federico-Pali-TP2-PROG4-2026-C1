import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Types } from "mongoose";

@Schema({ timestamps: true })
export class Comentario {
    @Prop({required: true})
    contenido: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'})
    creador: mongoose.Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Publicaciones'})
    publicacionId: mongoose.Types.ObjectId

    @Prop({default: true})
    es_activo: boolean; 

    @Prop({ default: false })
    modificado: boolean;
}
export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
