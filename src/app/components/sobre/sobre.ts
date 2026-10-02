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
    }, 4500); // Troca suave a cada 4.5s
  }

  pararCarrossel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  setImagem(index: number) {
    this.imagemAtiva.set(index);
    this.pararCarrossel();
    this.iniciarCarrossel(); 
  }
}