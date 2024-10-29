import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private apiUrl: string;
  private environment: string;
  private firebaseConfig: any;

  constructor() {
    // Define aqui suas configurações

    this.apiUrl = 'https://dentistas.com.br/config'; // URL base da sua API

    this.environment = 'ver 4.02'; // Ambiente atual 

    // Configuração do Firebase
    this.firebaseConfig = {
      authDomain: "dentistas-com-br-2025.firebaseapp.com",
      projectId: "dentistas-com-br-2025",
      storageBucket: "dentistas-com-br-2025.appspot.com",
    };
  }

  // Retorna a URL base da API
  getApiUrl(): string {
    return this.apiUrl;
  }

  // Retorna o ambiente atual
  getEnvironment(): string {
    return this.environment;
  }

  // Retorna as configurações do Firebase
  getFirebaseConfig(): any {
    return this.firebaseConfig;
  }
}
