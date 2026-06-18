import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appResaltarError]',
  standalone: true
})
export class ResaltarErrorDirective {
  constructor(private elemento: ElementRef, private control: NgControl) {}

  @HostListener('blur') alSalir() {
      if (this.control.invalid && this.control.touched) {
          this.elemento.nativeElement.style.border = '2px solid red';
      } else {
          this.elemento.nativeElement.style.border = '1px solid #cbd5e1';
      }
  }
}