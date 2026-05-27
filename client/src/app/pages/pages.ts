import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './pages.html',
  styleUrl: './pages.css',
})
export class Pages {}
