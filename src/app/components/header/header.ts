import { Component, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements AfterViewInit {
  menuAberto = false;
  isScrolled = false;
  isPlaying = false;

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  ngAfterViewInit() {
    const audio = this.audioPlayer.nativeElement;
    
    // Define o volume para 15% (0.15)
    audio.volume = 0.15;

    // Tenta iniciar a música automaticamente
    audio.play().then(() => {
      this.isPlaying = true;
    }).catch((error) => {
      // O navegador bloqueou o autoplay. O usuário precisa interagir com a página primeiro.
      console.log('Autoplay bloqueado pelo navegador. Aguardando interação do usuário.', error);
      this.isPlaying = false;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu() {
    this.menuAberto = false;
  }

  toggleAudio() {
    const audio = this.audioPlayer.nativeElement;
    
    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    
    this.isPlaying = !this.isPlaying;
  }

  onAudioEnded() {
    this.isPlaying = false;
  }
}