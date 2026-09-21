import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-erro404',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="pagina-erro">
      <div class="erro-container">
        <img src="/img/logo.png" alt="Logo" class="logo-animada">
        
        <h1>404</h1>
        <h2>Oops! Parece que você saiu da estrada.</h2>
        <p>A página que você está procurando não existe ou foi movida.</p>
        
        <a routerLink="/" class="btn-destaque">Voltar para o Início</a>
      </div>
    </section>
    <footer class="footer-erro">
      <div class="footer-content">
        <img src="/img/logo.png" alt="Logo " class="footer-logo">
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Mailson & Rafael. Todos os direitos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    .pagina-erro {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 85vh;
      background-color: #121212;
      text-align: center;
      padding: 150px 5% 50px;
    }
    .erro-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    .logo-animada {
      height: 140px;
      object-fit: contain;
      margin-bottom: 20px;
      animation: floatPulse 3s ease-in-out infinite;
      filter: drop-shadow(0 10px 15px rgba(229, 9, 20, 0.4));
    }
    h1 {
      font-size: 6rem;
      color: #e50914;
      margin: 0;
      line-height: 1;
      text-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
    }
    h2 {
      font-size: 2rem;
      color: #ffffff;
      margin: 0;
    }
    p {
      font-size: 1.2rem;
      color: #cccccc;
      margin-bottom: 30px;
    }
    
    /* Animação exclusiva dessa tela */
    @keyframes floatPulse {
      0% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-15px) scale(1.05); filter: drop-shadow(0 20px 25px rgba(229, 9, 20, 0.6)); }
      100% { transform: translateY(0) scale(1); }
    }
    
    .footer-erro {
      background-color: #050505;
      padding: 40px 5% 20px;
      border-top: 1px solid rgba(229, 9, 20, 0.3);
      text-align: center;
    }
    .footer-logo { height: 60px; opacity: 0.7; }
    .footer-bottom { border-top: 1px solid #1a1a1a; margin-top: 20px; padding-top: 20px; color: #555; font-size: 0.9rem; }
  `]
})
export class Erro404 {}