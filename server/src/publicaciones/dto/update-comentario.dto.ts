import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from '../../publicaciones/dto/create-comentario.dto';

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {}
