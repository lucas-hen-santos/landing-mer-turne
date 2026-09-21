import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  menuAberto = false;
  isScrolled = false;

  // Detecta quando a tela rolou para baixo para mudar o visual da Navbar
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  // Abre e fecha o menu no celular
  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  // Fecha o menu automaticamente quando um link é clicado
  fecharMenu() {
    this.menuAberto = false;
  }
}