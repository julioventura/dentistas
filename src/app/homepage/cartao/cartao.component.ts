import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-cartao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartao.component.html', 
  styleUrls: ['./cartao.component.scss']
})
export class CartaoComponent {
  public qrCodeUrl: string = 'https://dentistas.com.br/assets/qrcode_dentistascombr.png';

  constructor(public userService: UserService) {
    console.log('CartaoComponent initialized');
  }
  
  getEnderecoCompleto(): string {
    const userProfile = this.userService.userProfile;
    if (!userProfile) return '';
    
    // Tratamento para estrutura de endereços antiga ou nova
    if (userProfile.endereco) {
      return `${userProfile.endereco}, ${userProfile.cidade} - ${userProfile.estado}`;
    } else if (userProfile.enderecos && userProfile.enderecos.length > 0) {
      const endereco = Array.isArray(userProfile.enderecos) 
        ? userProfile.enderecos[0] 
        : JSON.parse(userProfile.enderecos)[0];
      return `${endereco.rua}, ${endereco.complemento || ''} - ${endereco.bairro}`;
    }
    
    return '';
  }
  
  getCidadeEstadoCep(): string {
    const userProfile = this.userService.userProfile;
    if (!userProfile) return '';
    
    if (userProfile.cidade && userProfile.estado) {
      return `${userProfile.cidade} - ${userProfile.estado}${userProfile.cep ? ', CEP ' + userProfile.cep : ''}`;
    } else if (userProfile.enderecos && userProfile.enderecos.length > 0) {
      const endereco = Array.isArray(userProfile.enderecos) 
        ? userProfile.enderecos[0] 
        : JSON.parse(userProfile.enderecos)[0];
      return `${endereco.cidade} - ${endereco.estado}${endereco.cep ? ', CEP ' + endereco.cep : ''}`;
    }
    
    return '';
  }
  
  // Formatador de telefone para exibição
  formatPhone(phone: string): string {
    if (!phone) return '';
    
    // Remove todos os caracteres não-numéricos
    const numbers = phone.replace(/\D/g, '');
    
    // Formata baseado no tamanho
    if (numbers.length === 11) { // Celular com DDD
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
    } else if (numbers.length === 10) { // Fixo com DDD
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    }
    
    return phone; // Retorna original se não conseguir formatar
  }
}