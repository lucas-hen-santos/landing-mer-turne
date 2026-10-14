import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class Loading implements OnInit {
  mostrarSplash = signal(true);
  iniciarSaida = signal(false);

  ngOnInit() {
    setTimeout(() => {
      this.iniciarSaida.set(true);
      
      setTimeout(() => {
        this.mostrarSplash.set(false);
      }, 600);
    }, 1500);
  }
}