import { Component, input, output } from '@angular/core';
import { Publi } from '../../services/publi.service';

@Component({
  selector: 'app-publi-card',
  imports: [],
  templateUrl: './publi-card.html',
  styleUrl: './publi-card.css',
})
export class PubliCard {
  publi = input.required<Publi>();

  onLike = output<string>();

  onComent = output<boolean>();

  emitirLike(id: string){
    this.onLike.emit(id);
  }

  emitirComentar(){
    this.onComent.emit(true);
  }
}
