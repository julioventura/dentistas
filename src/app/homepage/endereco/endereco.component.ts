import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/user.service';

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
export class EnderecoComponent implements OnInit {
  // Remover userProfile como Input
  
  constructor(public userService: UserService) {}
  
  ngOnInit() {
    // Sem código aqui - usaremos apenas o acesso direto pelo userService.userProfile
  }
  
  // Método para obter os endereços do userProfile
  getEnderecos(): Endereco[] {
    const userProfile = this.userService.userProfile; // Acesso direto
    if (!userProfile?.enderecos) return [];
    
    // Se for string (formato antigo), tenta converter
    if (typeof userProfile.enderecos === 'string') {
      try {
        return JSON.parse(userProfile.enderecos);
      } catch (e) {
        console.error('Erro ao converter endereços', e);
        return [];
      }
    }
    
    // Se já for array
    if (Array.isArray(userProfile.enderecos)) {
      return userProfile.enderecos;
    }
    
    return [];
  }
  
  // Verifica se existem endereços para exibir
  hasEnderecos(): boolean {
    const enderecos = this.getEnderecos();
    return enderecos.length > 0;
  }
}