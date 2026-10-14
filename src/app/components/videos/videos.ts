import { Component, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment'; 

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
  itensPorPagina = 6;
  
  videoAtivoUrl = signal<SafeResourceUrl | null>(null);
  mensagemErro = signal<string | null>(null);

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.verificarTamanhoTela();
    this.carregarVideosDaAPIYouTube();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.verificarTamanhoTela();
  }

  verificarTamanhoTela() {
    const largura = window.innerWidth;
    const novoLimite = largura <= 992 ? 3 : 6;
    if (this.itensPorPagina !== novoLimite) {
      this.itensPorPagina = novoLimite;
      this.paginaAtual = 1; 
      this.atualizarPagina();
    }
  }

  async carregarVideosDaAPIYouTube() {
    try {
      this.mensagemErro.set(null);
      const { apiKey, playlistId } = environment.youtube;
      
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
             
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const listaMapeada: VideoItem[] = data.items.map((item: any) => {
          const snippet = item.snippet;
          const videoId = snippet.resourceId.videoId;
          const thumbnails = snippet.thumbnails;
          const thumbUrl = thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;

          return {
            titulo: snippet.title,
            videoId: videoId,
            thumbnail: thumbUrl
          };
        });
        
        this.videos.set(listaMapeada);
        this.atualizarPagina();
      } else {
        this.mensagemErro.set('Nenhum vídeo encontrado nesta playlist.');
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos do YouTube:', error);
      this.mensagemErro.set('Erro ao carregar os vídeos automaticamente.');
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