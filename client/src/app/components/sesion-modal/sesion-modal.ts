import { Component, output } from '@angular/core';

@Component({
  selector: 'app-sesion-modal',
  imports: [],
  templateUrl: './sesion-modal.html',
  styleUrl: './sesion-modal.css',
})
export class SesionModal {

  onExtender = output<void>();
  onCerrar = output<void>();
}
