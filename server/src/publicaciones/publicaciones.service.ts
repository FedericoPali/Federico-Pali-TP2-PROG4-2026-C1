import { Injectable } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { UpdatePublicacionesDto } from './dto/update-publicaciones.dto';

@Injectable()
export class PublicacionesService {
  create(createPublicacionesDto: CreatePublicacionesDto) {
    return 'This action adds a new publicacione';
  }

  findAll() {
    return `This action returns all publicaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacione`;
  }

  update(id: number, updatePublicacionesDto: UpdatePublicacionesDto) {
    return `This action updates a #${id} publicacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicacione`;
  }
}
