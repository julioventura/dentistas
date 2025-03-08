import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-convenios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convenios.component.html', 
  styleUrls: ['./convenios.component.scss']
})
export class ConveniosComponent {
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
  
  horarios = [
    { dia: 'Segunda a Sexta', horario: '08:00 - 19:00' },
    { dia: 'Sábado', horario: '09:00 - 16:00' }
  ];
  
  // Dados padrão para quando não houver convênios no perfil
  conveniosDefault = [
    'Amil',
    'Bradesco Saúde',
    'SulAmérica',
    'Unimed'
  ];
  
  getEnderecoCompleto(): string {
    if (this.userProfile) {
        console.log("userProfile:", this.userProfile);

      return `${this.userProfile.endereco}, ${this.userProfile.cidade} - ${this.userProfile.estado}`;
    }
    return `${this.endereco.rua}, ${this.endereco.complemento} - ${this.endereco.bairro}`;
  }
  
  getCidadeEstadoCep(): string {
    if (this.userProfile) {
      return `${this.userProfile.cidade} - ${this.userProfile.estado}, CEP ${this.userProfile.cep}`;
    }
    else {
      return '';
    }
  }

  getConvenios() {
    return this.userProfile?.convenios || this.conveniosDefault;
  }
  
  // Verifica se existem convênios para exibir
  temConvenios(): boolean {
    return this.getConvenios().length > 0;
  }
}