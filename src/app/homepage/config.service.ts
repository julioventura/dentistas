import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private ambiente: string;
  public is_admin: boolean = false;

  constructor() {
    // Define aqui suas configurações
    this.ambiente = 'Dentistas.com.br - this.configuracoes 4.1.04 (em 03/03/2025)'; // Ambiente atual 
  }


  // Retorna o ambiente atual
  getAmbiente(): string {
    return this.ambiente;
  }

}
