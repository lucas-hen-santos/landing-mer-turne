import { Component, inject, ViewChild, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Mensagem {
  emissor: 'bot' | 'usuario';
  texto: string;
}

@Component({
  selector: 'app-contato-flutuante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-wrapper">
      @if (mostrarTooltip && !chatAberto && !mostrarNotificacao) {
        <div class="chat-tooltip">Entre em contato</div>
      }

      @if (mostrarNotificacao && !chatAberto) {
        <div class="balao-notificacao" (click)="toggleChat()">
          <span class="badge-notificacao">1</span>
          <p>✨ Pensando em levar nosso show para sua cidade? Fale com a gente!</p>
          <button class="fechar-notificacao" (click)="$event.stopPropagation(); mostrarNotificacao = false" aria-label="Fechar aviso">×</button>
        </div>
      }

      <button class="btn-chat-flutuante" (click)="toggleChat()"
               (mouseenter)="mostrarTooltip = true" (mouseleave)="mostrarTooltip = false"
              [class.ativo]="chatAberto" aria-label="Abrir central de atendimento">
        @if (!chatAberto) {
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
        } @else {
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        }
      </button>

      @if (chatAberto) {
        <div class="janela-chat">
          <div class="chat-header">
            <div class="status-avatar"></div>
            <div class="header-info">
              <h4>Atendimento Virtual</h4>
              <span>Online agora</span>
            </div>
          </div>

          <div class="chat-corpo" #scrollMe>
            @for (msg of historico; track $index) {
              <div class="balao-wrapper" [class.usuario]="msg.emissor === 'usuario'">
                <div class="balao">{{ msg.texto }}</div>
              </div>
            }

            @if (mostrarOpcoes) {
              <div class="container-opcoes">
                @for (opcao of opcoesIniciais; track $index) {
                  <button class="btn-opcao-rapida" (click)="selecionarOpcao(opcao)">
                    {{ opcao }}
                  </button>
                }
              </div>
            }

            @if (enviando) {
              <div class="balao-wrapper bot">
                <div class="balao digitando">Enviando dados...</div>
              </div>
            }

            @if (passoAtual === 5 && !enviando) {
              <div class="container-opcoes">
                <button class="btn-opcao-rapida btn-voltar" (click)="voltarAoMenu()">
                    Voltar ao Menu Principal
                </button>
              </div>
            }
          </div>

          @if (!mostrarOpcoes && passoAtual < 5) {
            <div class="chat-footer">
              <input type="text" [(ngModel)]="respostaAtual"
                      (keyup.enter)="enviarResposta()"
                      (input)="onInputMascara($event)"
                     [placeholder]="passoAtual === 3 ? 'Ex: (16) 99999-9999' : 'Digite sua resposta...'"
                      [maxlength]="passoAtual === 3 ? 15 : 300"
                     [disabled]="enviando">
              <button (click)="enviarResposta()" [disabled]="!respostaAtual.trim() || enviando" class="btn-enviar-texto">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes pulseChat {
      0% { box-shadow: 0 0 0 0 rgba(193, 122, 60, 0.8); }
      70% { box-shadow: 0 0 0 20px rgba(193, 122, 60, 0); }
      100% { box-shadow: 0 0 0 0 rgba(193, 122, 60, 0); }
    }

    @keyframes shakeIcon {
      0%, 100% { transform: rotate(0deg); }
      10% { transform: rotate(-15deg); }
      20% { transform: rotate(15deg); }
      30% { transform: rotate(-15deg); }
      40% { transform: rotate(15deg); }
      50%, 100% { transform: rotate(0deg); }
    }

    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.8) translateY(15px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    .chatbot-wrapper {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-family: 'Poppins', sans-serif;
    }

    .balao-notificacao {
      position: absolute;
      bottom: 80px;
      right: 0;
      background-color: #251d17;
      border-left: 4px solid #C17A3C;
      padding: 15px 35px 15px 20px;
      border-radius: 12px 12px 2px 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      cursor: pointer;
      width: max-content;
      max-width: 280px;
      animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      transition: transform 0.2s ease;
    }

    .balao-notificacao:hover {
      transform: translateY(-3px);
    }

    .balao-notificacao p {
      color: #F3E5D0;
      font-size: 0.95rem;
      font-weight: 600;
      line-height: 1.4;
      margin: 0;
    }

    .badge-notificacao {
      position: absolute;
      top: -10px;
      left: -10px;
      background-color: #9D4F24;
      color: #F3E5D0;
      font-size: 0.8rem;
      font-weight: bold;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #171310;
      box-shadow: 0 2px 8px rgba(157, 79, 36, 0.5);
    }

    .fechar-notificacao {
      position: absolute;
      top: 5px;
      right: 8px;
      background: none;
      border: none;
      font-size: 1.4rem;
      color: #C8B9A5;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      transition: color 0.2s ease;
    }

    .fechar-notificacao:hover { color: #C17A3C; }

    .btn-chat-flutuante {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background-color: #9D4F24;
      color: #F3E5D0;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      animation: pulseChat 2s infinite;
    }

    .btn-chat-flutuante svg {
      width: 28px;
      height: 28px;
      animation: shakeIcon 5s infinite ease-in-out;
    }

    .btn-chat-flutuante:hover {
      transform: scale(1.1);
      background-color: #C17A3C;
      box-shadow: 0 8px 30px rgba(193, 122, 60, 0.6);
      animation: none;
    }

    .btn-chat-flutuante.ativo {
      background-color: #302821;
      box-shadow: 0 5px 25px rgba(0,0,0,0.5);
      animation: none;
    }

    .btn-chat-flutuante.ativo svg {
      animation: none;
    }

    .chat-tooltip {
      background-color: #251d17;
      color: #F3E5D0;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: bold;
      margin-bottom: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      animation: fadeIn 0.3s ease;
    }

    .janela-chat {
      width: 360px;
      height: 500px;
      background-color: rgba(23, 19, 16, 0.98);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(200, 185, 165, 0.12);
      border-radius: 16px;
      bottom: 80px;
      position: absolute;
      right: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 15px 40px rgba(0,0,0,0.7);
      animation: fadeUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
    }

    .chat-header {
      background-color: #302821;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(200, 185, 165, 0.08);
    }

    .status-avatar {
      width: 12px;
      height: 12px;
      background-color: #1ed760;
      border-radius: 50%;
      box-shadow: 0 0 8px #1ed760;
    }

    .chat-header h4 { color: #F3E5D0; margin: 0; font-size: 1rem; }
    .chat-header span { color: #C8B9A5; font-size: 0.8rem; }

    .chat-corpo {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 15px;
      scroll-behavior: smooth;
    }

    .chat-corpo::-webkit-scrollbar { width: 5px; }
    .chat-corpo::-webkit-scrollbar-thumb { background: #503727; border-radius: 3px; }

    .balao-wrapper { display: flex; width: 100%; }
    .balao {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 14px 14px 14px 2px;
      font-size: 0.95rem;
      line-height: 1.4;
      background-color: #503727;
      color: #F3E5D0;
    }
    .balao-wrapper.usuario { justify-content: flex-end; }
    .balao-wrapper.usuario .balao {
      border-radius: 14px 14px 2px 14px;
      background-color: #9D4F24;
      color: #F3E5D0;
    }
    .digitando { font-style: italic; opacity: 0.7; }

    .container-opcoes { display: flex; flex-direction: column; gap: 8px; margin-top: 5px; }
    .btn-opcao-rapida {
      background-color: transparent;
      color: #C17A3C;
      border: 1px solid #C17A3C;
      padding: 10px 14px;
      border-radius: 8px;
      text-align: left;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-opcao-rapida:hover { background-color: #C17A3C; color: #171310; }

    .btn-voltar { border-color: #C8B9A5; color: #C8B9A5; text-align: center; margin-top: 10px; }
    .btn-voltar:hover { background-color: #C8B9A5; color: #171310; border-color: #C8B9A5; }

    .chat-footer {
      padding: 15px;
      background-color: #251d17;
      border-top: 1px solid rgba(200, 185, 165, 0.08);
      display: flex;
      gap: 10px;
    }
    .chat-footer input {
      flex: 1;
      background-color: #302821;
      border: 1px solid #503727;
      border-radius: 8px;
      padding: 12px;
      color: #F3E5D0;
      font-size: 0.95rem;
    }
    .chat-footer input:focus { outline: none; border-color: #C17A3C; }
    .chat-footer input:disabled { opacity: 0.5; }

    .btn-enviar-texto {
      background-color: #9D4F24;
      color: #F3E5D0;
      border: none;
      width: 45px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    }
    .btn-enviar-texto svg { width: 18px; height: 18px; }
    .btn-enviar-texto:hover { background-color: #C17A3C; color: #171310; }
    .btn-enviar-texto:disabled { background-color: #332821; cursor: not-allowed; opacity: 0.5; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }

    @media (max-width: 576px) {
      .chatbot-wrapper { bottom: 20px; right: 20px; }
      .janela-chat { width: calc(100vw - 40px); height: 450px; }
    }
  `]
})
export class ContatoFlutuante implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  chatAberto = false;
  mostrarTooltip = false;
  enviando = false;
  mostrarNotificacao = false;

  historico: Mensagem[] = [
    { emissor: 'bot', texto: 'Olá! Sou o assistente da equipe Mailson & Rafael. Como posso te ajudar hoje?' }
  ];

  opcoesIniciais = [
    'Contratar Show / Orçamento',
    'Imprensa e Parcerias',
    'Outros Assuntos'
  ];

  mostrarOpcoes = true;
  formData = { assunto: '', nome: '', email: '', telefone: '', mensagem: '' };
  respostaAtual = '';
  passoAtual = 0;

  ngOnInit() {
    setTimeout(() => {
      if (!this.chatAberto) {
        this.mostrarNotificacao = true;
        this.cdr.detectChanges();
      }
    }, 20000);
  }

  private rolarParaBaixo(): void {
    this.cdr.detectChanges();
    setTimeout(() => {
      try {
        if (this.myScrollContainer) {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
      } catch(err) { }
    }, 50);
  }

  toggleChat() {
    this.chatAberto = !this.chatAberto;
    this.mostrarTooltip = false;
    this.mostrarNotificacao = false;

    if (this.chatAberto) {
      setTimeout(() => this.rolarParaBaixo(), 50);
    }
  }

  selecionarOpcao(opcao: string) {
    this.formData.assunto = opcao;
    this.mostrarOpcoes = false;
    this.historico.push({ emissor: 'usuario', texto: opcao });
    this.rolarParaBaixo();
    setTimeout(() => {
      this.historico.push({ emissor: 'bot', texto: 'Ótimo! Para começarmos, qual é o seu nome completo ou o nome da sua empresa?' });
      this.passoAtual = 1;
      this.rolarParaBaixo();
    }, 300);
  }

  onInputMascara(event: Event) {
    if (this.passoAtual === 3) {
      const input = event.target as HTMLInputElement;
      let valor = input.value.replace(/\D/g, '');
      if (valor.length > 11) valor = valor.substring(0, 11);
      if (valor.length === 0) {
        this.respostaAtual = '';
      } else if (valor.length <= 2) {
        this.respostaAtual = `(${valor}`;
      } else if (valor.length <= 6) {
        this.respostaAtual = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
      } else if (valor.length <= 10) {
        this.respostaAtual = `(${valor.substring(0, 2)}) ${valor.substring(2, 6)}-${valor.substring(6)}`;
      } else {
        this.respostaAtual = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7)}`;
      }
    }
  }

  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  enviarResposta() {
    const texto = this.respostaAtual.trim();
    if (!texto) return;
    this.historico.push({ emissor: 'usuario', texto });
    this.respostaAtual = '';
    this.rolarParaBaixo();
    setTimeout(() => {
      this.processarFluxo(texto);
    }, 300);
  }

  private processarFluxo(texto: string) {
    switch (this.passoAtual) {
      case 1:
        this.formData.nome = texto;
        this.historico.push({ emissor: 'bot', texto: `Prazer, ${texto}! Qual é o melhor e-mail para enviarmos nossa resposta ou proposta?` });
        this.passoAtual = 2;
        break;
      case 2:
        if (!this.validarEmail(texto)) {
          this.historico.push({ emissor: 'bot', texto: 'Ops! Esse e-mail não parece válido. Por favor, digite um e-mail correto (ex: seu.nome@email.com):' });
          break;
        }
        this.formData.email = texto;
        this.historico.push({ emissor: 'bot', texto: 'Perfeito. Por favor, digite também um número de WhatsApp com DDD:' });
        this.passoAtual = 3;
        break;
      case 3:
        const numeroLimpo = texto.replace(/\D/g, '');
        if (numeroLimpo.length < 10) {
          this.historico.push({ emissor: 'bot', texto: 'Por favor, informe o número completo com o DDD (ex: (16) 99999-9999):' });
          break;
        }
        this.formData.telefone = texto;
        this.historico.push({ emissor: 'bot', texto: 'Para finalizar, me conte os detalhes (se for show, informe a cidade, data e local):' });
        this.passoAtual = 4;
        break;
      case 4:
        this.formData.mensagem = texto;
        this.passoAtual = 5;
        this.dispararEmail();
        break;
    }
    this.rolarParaBaixo();
  }

  private dispararEmail() {
    this.enviando = true;
    this.rolarParaBaixo();
    const payload = {
      access_key: environment.web3FormsAccessKey,
      subject: `[Site] ${this.formData.assunto} - ${this.formData.nome}`,
      Nome: this.formData.nome,
      Email: this.formData.email,
      Telefone: this.formData.telefone,
      Assunto: this.formData.assunto,
      Mensagem: this.formData.mensagem
    };

    this.http.post('https://api.web3forms.com/submit', payload).subscribe({
      next: () => {
        this.enviando = false;
        this.historico.push({ emissor: 'bot', texto: '✅ Tudo certo! Seus dados foram enviados com sucesso para a nossa equipe. Retornaremos em breve.' });
        this.rolarParaBaixo();
      },
      error: (err) => {
        console.error(err);
        this.enviando = false;
        this.historico.push({ emissor: 'bot', texto: '⚠️ Ocorreu um erro ao enviar. Por favor, tente falar conosco pelas nossas redes sociais.' });
        this.rolarParaBaixo();
      }
    });
  }

  voltarAoMenu() {
    this.mostrarOpcoes = true;
    this.passoAtual = 0;
    this.formData = { assunto: '', nome: '', email: '', telefone: '', mensagem: '' };
    this.respostaAtual = '';
    this.historico.push({ emissor: 'bot', texto: 'Como posso te ajudar novamente? Escolha uma das opções abaixo:' });
    this.rolarParaBaixo();
  }
}