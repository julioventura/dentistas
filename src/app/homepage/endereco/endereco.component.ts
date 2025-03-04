import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-endereco',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './endereco.component.html', 
  styleUrls: ['./endereco.component.scss']
})
export class EnderecoComponent {
  @Input() showIcon: boolean = true;
  @Input() darkMode: boolean = false;
  @Input() userProfile: any; // Recebe dados do perfil
  
  // Dados padrão, usados apenas se userProfile não for fornecido
  endereco = {
    rua: 'Av. Paulista, 1000',
    complemento: 'Sala 501',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    telefone: '(11) 3456-7890',
    email: 'contato@dentistaapp.com.br'
  };
  

  getEnderecoCompleto(): string {
    if (this.userProfile) {
      return `${this.userProfile.endereco || ''}, ${this.userProfile.bairro || ''} - ${this.userProfile.cidade || ''}, ${this.userProfile.estado || ''}`;
    }
    return `${this.endereco.rua}, ${this.endereco.complemento} - ${this.endereco.bairro}`;
  }
  
  getCidadeEstadoCep(): string {
    if (this.userProfile) {
      return `${this.userProfile.cidade || 'XXXXXX'} - ${this.userProfile.estado || 'XX'}, CEP ${this.userProfile.cep || 'XXXXX-XXX'}`;
    }
    else {
      return '';
    }
  }

  getCep(): string {
    return this.userProfile?.cep || '';
  }
}