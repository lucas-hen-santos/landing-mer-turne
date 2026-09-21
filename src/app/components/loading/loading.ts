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
    // Tempo que a tela de carregamento fica visível (ex: 1.8 segundos)
    setTimeout(() => {
      this.iniciarSaida.set(true);
      
      // Remove o componente do DOM após a animação de fade-out terminar (0.6s)
      setTimeout(() => {
        this.mostrarSplash.set(false);
      }, 600);
    }, 1500);
  }
}