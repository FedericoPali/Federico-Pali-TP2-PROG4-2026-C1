import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mencionResaltada',
})
export class MencionResaltadaPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
