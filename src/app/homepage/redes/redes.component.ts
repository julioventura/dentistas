import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-redes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redes.component.html', 
  styleUrls: ['./redes.component.scss']
})
export class RedesComponent {
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
  
  horarios = [
    { dia: 'Segunda a Sexta', horario: '08:00 - 19:00' },
    { dia: 'Sábado', horario: '09:00 - 16:00' }
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

  // Para RedesComponent
  hasRedesSociais(): boolean {
    return !!(
      this.userProfile?.instagram || 
      this.userProfile?.facebook || 
      this.userProfile?.linkedin || 
      this.userProfile?.youtube || 
      this.userProfile?.website
    );
  }

  getInstagramUrl(): string {
    const username = this.userProfile?.instagram?.replace('@', '');
    return `https://instagram.com/${username}`;
  }

  getFacebookUrl(): string {
    return this.userProfile?.facebook;
  }

  getLinkedinUrl(): string {
    return this.userProfile?.linkedin;
  }

  getYoutubeUrl(): string {
    return this.userProfile?.youtube;
  }
}