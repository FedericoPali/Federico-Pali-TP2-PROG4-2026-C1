import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mencionResaltada',
})
export class MencionResaltadaPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value) return '';

    const regex = /@(\w+)/g;

    return value.replace(regex, '<span class="mencion-azul">@$1</span>');
  }
}
