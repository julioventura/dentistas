import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-capa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './capa.component.html', 
  styleUrls: ['./capa.component.scss']
})
export class CapaComponent {
  
  constructor(public userService: UserService) { } 

  public qrCodeUrl: string = 'https://dentistas.com.br/assets/qrcode_dentistascombr.png';

  
  
  getEnderecoCompleto(): string {
    if (this.userService.userProfile) {
        console.log("userProfile:", this.userService.userProfile);

      return `${this.userService.userProfile.endereco}, ${this.userService.userProfile.cidade} - ${this.userService.userProfile.estado}`;
    }
    return `${this.userService.userProfile.endereco.rua}, ${this.userService.userProfile.cidade} - ${this.userService.userProfile.bairro}`;
  }
  
  getCidadeEstadoCep(): string {
    if (this.userService.userProfile) {
      return `${this.userService.userProfile.cidade} - ${this.userService.userProfile.estado}, CEP ${this.userService.userProfile.cep}`;
    }
    else {
      return '';
    }
  }

  getBackgroundImage(): string {
    // Se o usuário tiver uma foto de capa, use-a. Caso contrário, use uma imagem padrão
    const backgroundImage = this.userService.userProfile?.fotoCapa || 'assets/images/dental-office-background.jpg';
    return `url('${backgroundImage}')`;
  }

  // Método para formatar especialidades
  formatEspecialidades(): string {
    if (!this.userService.userProfile?.especialidades || this.userService.userProfile.especialidades.length === 0) {
      return '';
    }
    
    return this.userService.userProfile.especialidades.join(' • ');
  }


  getWhatsapp(): string {
    if (!this.userService.userProfile?.whatsapp) return '5511999999999'; // Número padrão
    
    // Remove caracteres não numéricos
    return this.userService.userProfile.whatsapp.replace(/\D/g, '');
  }

  getWhatsappFormatado(): string {
    if (!this.userService.userProfile?.whatsapp) return '5511999999999';
    return this.userService.userProfile.whatsapp.replace(/\D/g, '');
  }

  // Dados principais e foto
  getNome() {
    return this.userService.userProfile?.nome || 'Dentista';
  }

  getEspecialidades() {
    const especialidades = this.userService.userProfile?.especialidades || '';
    return typeof especialidades === 'string' ? especialidades.split(',').map(e => e.trim()) : [];
  }

  getProfileImage() {
    return this.userService.userProfile?.foto || 'https://dentistas.com.br/assets/default-profile.png';
  }

}