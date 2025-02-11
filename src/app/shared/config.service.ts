import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private ambiente: string;
  public is_admin: boolean = false;

  constructor() {
    // Define aqui suas configurações
<<<<<<< HEAD
    this.ambiente = 'Dentistas.com.br 4.07 (10/02/25)'; // Ambiente atual 
=======
    this.ambiente = 'Dentistas.com.br 4.06 (06/02/25)'; // Ambiente atual 
>>>>>>> de9f3c69796e80eb5a27dda2b23f91ffb37f5906
  }


  // Retorna o ambiente atual
  getAmbiente(): string {
    return this.ambiente;
  }

}
