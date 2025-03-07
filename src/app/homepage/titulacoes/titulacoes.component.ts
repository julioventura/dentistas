import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-titulacoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './titulacoes.component.html', 
  styleUrls: ['./titulacoes.component.scss']
})
export class TitulacoesComponent {
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
  
  // Adicionando a propriedade formacaoPadrao que estava faltando
  formacaoPadrao = [
    { 
      curso: 'Graduação em Odontologia',
      instituicao: 'Universidade de São Paulo (USP)',
      ano: '2010'
    },
    {
      curso: 'Especialização em Ortodontia',
      instituicao: 'Associação Brasileira de Odontologia (ABO)',
      ano: '2012'
    }
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

  getFormacao() {
    return this.userProfile?.formacao || this.formacaoPadrao;
  }

  getEspecialidades() {
    // Esse campo pode ser um string no PROFILE_FORM_FIELDS, mas pode precisar ser um array na exibição
    const especialidades = this.userProfile?.especialidades || '';
    return typeof especialidades === 'string' ? especialidades.split(',').map(e => e.trim()) : [];
  }
}