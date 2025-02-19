// filepath: /c:/contexto/dentistas/src/app/shared/subcolecao.service.ts
import { Injectable } from '@angular/core';

export interface Subcolecao {
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubcolecaoService {
  private subcolecoes: Subcolecao[] = [
    { nome: 'exames' },
    { nome: 'planos' },
    { nome: 'atendimentos' },
    { nome: 'pagamentos' },
    { nome: 'erupcoes' },
    { nome: 'risco' },
    { nome: 'retornos' },
    { nome: 'historico' }
  ];

  getSubcolecoesDisponiveis(): Subcolecao[] {
    return this.subcolecoes;
  }
}