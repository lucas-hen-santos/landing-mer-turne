import { Component } from '@angular/core';
import { Hero } from "../hero/hero";
import { Sobre } from "../sobre/sobre";
import { Clipe } from "../clipe/clipe";
import { Agenda } from "../agenda/agenda";
import { Contato } from "../contato/contato";
import { Contratante } from '../contratante/contratante';
import { Videos } from '../videos/videos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Sobre, Clipe, Agenda, Contato, Contratante, Videos],
  template: `
    <app-hero></app-hero>
    <app-sobre></app-sobre>
    <app-clipe></app-clipe>
    <app-agenda></app-agenda>
    <app-videos></app-videos>
    <app-contratante></app-contratante>
    <app-contato></app-contato>
  `
})
export class Home {}