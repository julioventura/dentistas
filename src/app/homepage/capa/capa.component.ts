import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-capa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './capa.component.html', 
  styleUrls: ['./capa.component.scss']
})
export class CapaComponent {
  @Input() showIcon: boolean = true;
  @Input() darkMode: boolean = false;
  @Input() userProfile: any; // Recebe dados do perfil

  
  // Dados padrão, usados apenas se userProfile não for fornecido

  public qrCodeUrl: string = 'https://dentistas.com.br/assets/qrcode_dentistascombr.png';

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

  getBackgroundImage(): string {
    // Se o usuário tiver uma foto de capa, use-a. Caso contrário, use uma imagem padrão
    const backgroundImage = this.userProfile?.fotoCapa || 'assets/images/dental-office-background.jpg';
    return `url('${backgroundImage}')`;
  }

  // Método para formatar especialidades
  formatEspecialidades(): string {
    if (!this.userProfile?.especialidades || this.userProfile.especialidades.length === 0) {
      return '';
    }
    
    return this.userProfile.especialidades.join(' • ');
  }


  getWhatsapp(): string {
    if (!this.userProfile?.whatsapp) return '5511999999999'; // Número padrão
    
    // Remove caracteres não numéricos
    return this.userProfile.whatsapp.replace(/\D/g, '');
  }

  getWhatsappFormatado(): string {
    if (!this.userProfile?.whatsapp) return '5511999999999';
    return this.userProfile.whatsapp.replace(/\D/g, '');
  }

  // Dados principais e foto
  getNome() {
    return this.userProfile?.nome || 'Dentista';
  }

  getEspecialidades() {
    const especialidades = this.userProfile?.especialidades || '';
    return typeof especialidades === 'string' ? especialidades.split(',').map(e => e.trim()) : [];
  }

  getProfileImage() {
    return this.userProfile?.foto || 'https://dentistas.com.br/assets/default-profile.png';
  }

}