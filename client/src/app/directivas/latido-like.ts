import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appLatidoLike]',
  standalone: true
})
export class LatidoLikeDirective {

  @HostBinding('class.corazon-activo') estaLikeado = false;

  @Input('appLatidoLike') 
  set recibirEstado(valor: boolean) {
    this.estaLikeado = valor;
  }

  @HostListener('click') alHacerClic() {
    
    this.estaLikeado = (!this.estaLikeado)
    
  }
}