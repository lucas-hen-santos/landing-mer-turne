import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import * as AOS from 'aos';

interface Show {
  id: string;
  dia: string;
  mes: string;
  cidade: string;
  local: string;
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss'
})
export class Agenda implements OnInit {
  shows: Show[] = [];
  showsExibidos: Show[] = [];
  paginaAtual = 1;
  itensPorPagina = 5;

  carregando = true;
  erro = false;

  // Referência para o topo da seção da agenda
  @ViewChild('agendaSecao') private agendaSecao!: ElementRef;

  private http = inject(HttpClient);

  ngOnInit() {
    this.carregarAgenda();
  }

  carregarAgenda() {
    const hoje = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${environment.googleCalendarId}/events?key=${environment.googleCalendarApiKey}&singleEvents=true&orderBy=startTime&timeMin=${hoje}&maxResults=20`;

    this.http.get<any>(url).subscribe({
      next: (resposta) => {
        this.shows = resposta.items.map((item: any) => this.formatarEvento(item));
        this.atualizarPagina();
        this.carregando = false;
        setTimeout(() => AOS.refresh(), 100);
      },
      error: (err) => {
        console.error('Erro ao buscar a agenda:', err);
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  atualizarPagina() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.showsExibidos = this.shows.slice(inicio, fim);
  }

  mudarPagina(direcao: number) {
    this.paginaAtual += direcao;
    this.atualizarPagina();
    
    // Rola suavemente para o topo da agenda para manter o foco do usuário
    if (this.agendaSecao) {
      this.agendaSecao.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => AOS.refresh(), 50);
  }

  private formatarEvento(item: any): Show {
    let dataObjeto: Date;
    if (item.start.date) {
      const [ano, mes, dia] = item.start.date.split('-').map(Number);
      dataObjeto = new Date(ano, mes - 1, dia); 
    } else {
      dataObjeto = new Date(item.start.dateTime);
    }
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return {
      id: item.id,
      dia: String(dataObjeto.getDate()).padStart(2, '0'),
      mes: meses[dataObjeto.getMonth()],
      cidade: item.summary || 'A definir',
      local: item.location || 'Local a definir'
    };
  }
}