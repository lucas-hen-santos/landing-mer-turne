import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Erro404 } from './components/erro404/erro404';

export const routes: Routes = [
  { path: '', component: Home },      
  { path: '**', component: Erro404 }  
];