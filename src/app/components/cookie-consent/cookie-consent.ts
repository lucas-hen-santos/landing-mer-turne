import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.scss'
})
export class CookieConsent implements OnInit {
  // Usamos o signal nativo do Angular para reatividade moderna
  mostrarBanner = signal(false);

  ngOnInit() {
    // Verifica se o usuário já aceitou os cookies anteriormente
    const consentimento = localStorage.getItem('cookieConsent');
    if (!consentimento) {
      this.mostrarBanner.set(true);
    }
  }

  aceitarCookies() {
    // Salva a decisão no navegador e esconde o banner
    localStorage.setItem('cookieConsent', 'aceito');
    this.mostrarBanner.set(false);
  }
}