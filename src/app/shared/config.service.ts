import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private ambiente: string;
  public is_admin: boolean = false;

  constructor() {
    // Define aqui suas configurações
    this.ambiente = 'Dentistas.com.br - Versão 4.11 (em 17/02/2025)'; // Ambiente atual 
  }


  // Retorna o ambiente atual
  getAmbiente(): string {
    return this.ambiente;
  }

}
