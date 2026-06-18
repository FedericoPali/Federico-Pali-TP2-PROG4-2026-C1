import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appResaltarError]',
  standalone: true
})
export class ResaltarErrorDirective {

  @Input('appResaltarError') tieneError: boolean = false;

  constructor(private elemento: ElementRef) {}

  @HostListener('blur') alSalir() {
    if (this.tieneError) {
      this.elemento.nativeElement.style.border = '2px solid red';
    } else {
      this.elemento.nativeElement.style.border = 'none';
    }
  }
}