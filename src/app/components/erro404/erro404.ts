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
        <img src="/img/logo.png" alt="Logo" class="footer-logo">
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
      background: linear-gradient(180deg, #171310 0%, #302821 100%);
      text-align: center;
      padding: 150px 5% 50px;
    }

    .erro-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      max-width: 600px;
    }

    .logo-animada {
      height: 130px;
      object-fit: contain;
      margin-bottom: 10px;
      animation: floatPulse 3s ease-in-out infinite;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6));
    }

    h1 {
      font-size: 6rem;
      color: #C17A3C; /* Âmbar / Caramelo da identidade visual */
      margin: 0;
      line-height: 1;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-shadow: 0 0 25px rgba(193, 122, 60, 0.3);
    }

    h2 {
      font-size: 2rem;
      color: #F3E5D0; /* Texto Creme */
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    p {
      font-size: 1.15rem;
      color: #C8B9A5; /* Tom secundário padrão do site */
      margin-bottom: 30px;
      line-height: 1.6;
    }

    /* Botão alinhado ao padrão de destaque do site */
    .btn-destaque {
      background-color: #C17A3C;
      color: #171310;
      padding: 14px 32px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      box-shadow: 0 5px 20px rgba(193, 122, 60, 0.3);

      &:hover {
        background-color: #d68948;
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(193, 122, 60, 0.4);
      }
    }

    /* Animação de flutuação suave da logo */
    @keyframes floatPulse {
      0% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-12px) scale(1.03); filter: drop-shadow(0 15px 20px rgba(193, 122, 60, 0.4)); }
      100% { transform: translateY(0) scale(1); }
    }

    .footer-erro {
      background-color: #171310; /* Preto Quente */
      padding: 40px 5% 20px;
      border-top: 1px solid rgba(193, 122, 60, 0.2);
      text-align: center;
    }

    .footer-logo {
      height: 55px;
      object-fit: contain;
      opacity: 0.8;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      margin-top: 20px;
      padding-top: 20px;
      color: #8c7b6d;
      font-size: 0.9rem;
    }
  `]
})
export class Erro404 {}