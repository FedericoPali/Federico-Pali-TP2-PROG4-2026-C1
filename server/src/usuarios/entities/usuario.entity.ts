import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Usuario extends Document {
    @Prop({ required: true })
    nombre!: string;

    @Prop({ required: true })
    apellido!: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true, unique: true }) 
    nombre_usuario!: string;

    @Prop({ required: true })
    contrasena!: string;

    @Prop()
    fecha_nacimiento!: string;

    @Prop()
    descripcion_breve!: string;

    @Prop()
    imagen_perfil!: string;

    @Prop({ default: false })
    es_admin!: boolean;

    @Prop({ default: true })
    es_activo!: boolean;

    // al usar unique, no permitimos que haya mails o nombres de usuario repetidos.
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);