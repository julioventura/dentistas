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
    this.apiUrl = 'https://api.example.com'; // URL base da sua API
    this.environment = 'development'; // Ambiente atual (ex: development, production)

    // Configuração do Firebase
    this.firebaseConfig = {
      apiKey: "AIzaSyD3D1Rrl4ov9wDMkjMH7BrGwSIoYbbgSyQ",
      authDomain: "dentistas-com-br-2025.firebaseapp.com",
      projectId: "dentistas-com-br-2025",
      storageBucket: "dentistas-com-br-2025.appspot.com",
      messagingSenderId: "62096953183",
      appId: "1:62096953183:web:d23421cecbd0caebc2b0ea",
      measurementId: "G-657HTS1CNX"
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
