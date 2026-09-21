import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
import { Header } from "./components/header/header";
import { ContatoFlutuante } from "./components/contato-flutuante/contato-flutuante";
import { CookieConsent } from "./components/cookie-consent/cookie-consent";
import { Loading } from './components/loading/loading';
// import { Loading } from "./components/loading/loading"; // <--- Adicione aqui

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ContatoFlutuante, CookieConsent, Loading], // <--- Adicione nos imports
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('landing-page-dupla');

  ngOnInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100
    });
  }
}