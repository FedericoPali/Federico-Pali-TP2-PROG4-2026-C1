import { Component, inject, signal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { EstadisticasService } from '../../services/estadisticas.service';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-estadisticas',
  imports: [FormsModule, BaseChartDirective],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas {
  estadisticasS = inject(EstadisticasService);

  fechaInicio = signal('');
  fechaFin = signal('');

  publicacionesData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });
  publicacionesOptions: ChartOptions<'bar'> = { responsive: true };

  comentariosTiempoData =  signal<ChartData<'line'>>({ labels: [], datasets: [] });
  comentariosTiempoOptions: ChartOptions<'line'> = { responsive: true };

  comentariosPublicacionData = signal<ChartData<'pie'>>({ labels: [], datasets: [] });
  comentariosOptions: ChartOptions<'pie'> = { responsive: true };

  async cargarPublicacionesPorUsuario() {
    const respuesta = await this.estadisticasS.getPublicacionesByUsuario(this.fechaInicio(), this.fechaFin()) as any[];
    console.log('Respuesta del back:', respuesta)
    this.publicacionesData.set({
      labels: respuesta.map(item => item.nombre_usuario),
      datasets: [{ label: 'Publicaciones', data: respuesta.map(item => item.cantidad) }]
    });
  }

  async cargarComentariosPorTiempo() {
    const respuesta = await this.estadisticasS.getComentariosByTiempo(this.fechaInicio(), this.fechaFin()) as any[];
    console.log('Respuesta del back:', respuesta)
    this.comentariosTiempoData.set({
      labels: respuesta.map(item => item.fecha),
      datasets: [{ label: 'Comentarios', data: respuesta.map(item => item.cantidad) }]
    });
  }

  async cargarComentariosPorPublicacion() {
    const respuesta = await this.estadisticasS.getComentariosByPublicacion(this.fechaInicio(), this.fechaFin()) as any[];
    console.log('Respuesta del back:', respuesta)
    this.comentariosPublicacionData.set({
      labels: respuesta.map(item => item.titulo),
      datasets: [{ label: 'Comentarios', data: respuesta.map(item => item.cantidad) }]
    });
  }

  async cargarTodo() {
    await this.cargarPublicacionesPorUsuario();
    await this.cargarComentariosPorTiempo();
    await this.cargarComentariosPorPublicacion();
  }
}

