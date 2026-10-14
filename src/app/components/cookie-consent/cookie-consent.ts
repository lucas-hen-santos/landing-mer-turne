import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.scss'
})
export class CookieConsent implements OnInit {
  mostrarBanner = signal(false);

  ngOnInit() {
    const consentimento = localStorage.getItem('cookieConsent');
    if (!consentimento) {
      this.mostrarBanner.set(true);
    }
  }

  aceitarCookies() {
    localStorage.setItem('cookieConsent', 'aceito');
    this.mostrarBanner.set(false);
  }
}