import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre.html',
  styleUrl: './sobre.scss'
})
export class Sobre implements OnInit, OnDestroy {
  // Array com os caminhos das 5 fotos padronizadas em PNG
  imagens = [
    '/img/DS1.png',
    '/img/DS2.png',
    '/img/DS3.png',
    '/img/DS4.png',
    '/img/DS5.png'
  ];
  
  imagemAtiva = signal(0);
  private intervalId: any;

  ngOnInit() {
    this.iniciarCarrossel();
  }

  ngOnDestroy() {
    this.pararCarrossel();
  }

  iniciarCarrossel() {
    this.intervalId = setInterval(() => {
      this.imagemAtiva.update(val => (val + 1) % this.imagens.length);
    }, 4000); // Troca a foto a cada 4 segundos automaticamente
  }

  pararCarrossel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Permite ao utilizador clicar nas bolinhas para escolher a foto
  setImagem(index: number) {
    this.imagemAtiva.set(index);
    this.pararCarrossel();
    this.iniciarCarrossel(); // Reinicia a contagem para não pular rápido demais
  }
}