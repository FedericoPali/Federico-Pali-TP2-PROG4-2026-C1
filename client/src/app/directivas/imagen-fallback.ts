import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImagenFallback]',
  standalone: true
})
export class ImagenFallbackDirective {

  private imagenPorDefecto = 'images/imagen-error.png'; 

  constructor(private elemento: ElementRef) {}

  @HostListener('error') alFallar() {
    this.elemento.nativeElement.src = this.imagenPorDefecto;
  }
}