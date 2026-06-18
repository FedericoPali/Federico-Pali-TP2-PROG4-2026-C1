import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'haceCuanto',
})
export class HaceCuantoPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    const hoy = new Date();
    const diferencia = hoy.getTime() - new Date(value).getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if(dias === 0){
      return "Hoy"
    } else if (dias === 1){
      return "Ayer"
    } else if (dias < 7){
      return `Hace ${dias} días`
    } else if (dias < 14){
      return `Hace 1 semana`
    } else if (dias < 30){
      return `Hace ${Math.floor(dias / 7)} semana`
    } else if (dias < 60){
      return `Hace 1 mes`
    } else {
      return `Hace ${Math.floor(dias / 30)} meses`
    }
  }
}
