import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroPalabras',
})
export class FiltroPalabrasPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
