import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
    constructor(private readonly estadisticasService: EstadisticasService) {}
    

    @UseGuards(AdminGuard)
    @Get('publicaciones-por-usuario')
    publicacionesPorUsuario(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
        return this.estadisticasService.publicacionesPorUsuario(fechaInicio, fechaFin);
    }

    @UseGuards(AdminGuard)
    @Get('comentarios-por-tiempo')
    comentariosPorTiempo(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
        return this.estadisticasService.comentariosPorTiempo(fechaInicio, fechaFin);
    }

    @UseGuards(AdminGuard)
    @Get('comentarios-por-publicacion')
    comentariosPorPublicacion(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
        return this.estadisticasService.comentariosPorPublicacion(fechaInicio, fechaFin);
    }
}
