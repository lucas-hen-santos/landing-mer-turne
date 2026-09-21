import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio('/audio/tricar.wav');
  
  tocando = signal(false);
  mutado = signal(false);

  constructor() {
    this.audio.loop = true;
    this.audio.volume = 0.4; // Volume mediano (40%)
  }

  togglePlay() {
    if (this.tocando()) {
      this.audio.pause();
      this.tocando.set(false);
    } else {
      this.audio.play().then(() => {
        this.tocando.set(true);
      }).catch(err => {
        console.log("Reprodução bloqueada pelo navegador:", err);
      });
    }
  }

  toggleMute() {
    this.mutado.update(m => !m);
    this.audio.muted = this.mutado();
  }
}