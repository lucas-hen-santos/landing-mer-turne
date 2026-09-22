import { Component, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface VideoItem {
  titulo: string;
  videoId: string;
  thumbnail: string;
}

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videos.html',
  styleUrl: './videos.scss'
})
export class Videos implements OnInit {
  videos = signal<VideoItem[]>([]);
  videosExibidos: VideoItem[] = [];
  
  paginaAtual = 1;
  itensPorPagina = 6; // Valor padrão para desktop

  videoAtivoUrl = signal<SafeResourceUrl | null>(null);

  readonly playlistId = 'PLgJCUor4xs-3Z4dEctY4fwlSY55BFq7vb'; 

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.verificarTamanhoTela();
    this.carregarVideosDoYouTube();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.verificarTamanhoTela();
  }

  verificarTamanhoTela() {
    // Se a largura da tela for menor ou igual a 992px (celular/tablet), mostra 3 por página
    const largura = window.innerWidth;
    const novoLimite = largura <= 992 ? 3 : 6;

    if (this.itensPorPagina !== novoLimite) {
      this.itensPorPagina = novoLimite;
      this.paginaAtual = 1; // Reseta para a primeira página ao redimensionar
      this.atualizarPagina();
    }
  }

  async carregarVideosDoYouTube() {
    try {
      const url = `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fplaylist_id%3D${this.playlistId}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.items) {
        const listaMapeada: VideoItem[] = data.items.map((item: any) => {
          const videoId = item.link.split('v=')[1] || item.guid.split(':').pop();
          return {
            titulo: item.title,
            videoId: videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          };
        });
        this.videos.set(listaMapeada);
        this.atualizarPagina();
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos do YouTube:', error);
    }
  }

  atualizarPagina() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.videosExibidos = this.videos().slice(inicio, fim);
  }

  mudarPagina(direcao: number) {
    this.paginaAtual += direcao;
    this.atualizarPagina();
  }

  abrirVideo(videoId: string) {
    const unsafeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    this.videoAtivoUrl.set(safeUrl);
  }

  fecharModal() {
    this.videoAtivoUrl.set(null);
  }
}