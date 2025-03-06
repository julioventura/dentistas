import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Endereco {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
}

@Component({
  selector: 'app-enderecos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.scss']
})
export class EnderecoComponent {
  @Input() showIcon: boolean = true;
  @Input() darkMode: boolean = false;
  @Input() userProfile: any;
  
  // Método para obter os endereços do userProfile
  getEnderecos(): Endereco[] {
    // console.log('getEnderecos()');
    // console.log('userProfile', this.userProfile);
    
    if (!this.userProfile?.enderecos) return [];
    
    // console.log('userProfile.enderecos', this.userProfile?.enderecos);

    // Se for string (formato antigo), tenta converter
    if (typeof this.userProfile.enderecos === 'string') {
      try {
        return JSON.parse(this.userProfile.enderecos);
      } catch (e) {
        console.error('Erro ao converter endereços', e);
        return [];
      }
    }
    
    // Se já for array
    if (Array.isArray(this.userProfile.enderecos)) {
      // console.log('userProfile.enderecos é um array');
      // console.log('userProfile.enderecos', this.userProfile.enderecos);

      return this.userProfile.enderecos;
    }
    
    return [];
  }
  
  // Verifica se existem endereços para exibir
  hasEnderecos(): boolean {
    // console.log('hasEnderecos()');
    const enderecos = this.getEnderecos();
    return enderecos.length > 0;
  }
}