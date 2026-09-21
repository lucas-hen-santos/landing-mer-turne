import { Component } from '@angular/core';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [], 
  templateUrl: './contato.html',
  styleUrl: './contato.scss'
})
export class Contato {
  // A lógica de formulário foi removida.
  // Toda a captação de contatos agora ocorre no app-contato-flutuante.
}