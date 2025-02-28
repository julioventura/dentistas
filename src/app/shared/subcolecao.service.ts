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
    { nome: 'documentos' },
    { nome: 'planos' },
    { nome: 'atendimentos' },
    { nome: 'tratamentos' },
    { nome: 'pagamentos' },
    { nome: 'dentes' },
    { nome: 'dentesendo' },
    { nome: 'dentesperio' },
    { nome: 'anamnese' },
    { nome: 'diagnosticos' },
    { nome: 'risco' },
  ];

  getSubcolecoesDisponiveis(): Subcolecao[] {
    return this.subcolecoes;
  }
}