import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroPalabras',
})
export class FiltroPalabrasPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value) return '';

    let textoFiltrado = value;

    const malasPalabras = ['puto', 'maricon', 'pelotudo', 'forro', 'mierda', 'hijo de puta', 'trolo'];
    
    malasPalabras.forEach(element => {
      textoFiltrado = textoFiltrado.replace(new RegExp(element, 'gi'), '***');
    });

    return textoFiltrado;
  }
}
