import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cartao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartao.component.html', 
  styleUrls: ['./cartao.component.scss']
})
export class CartaoComponent {
  @Input() showIcon: boolean = true;
  @Input() darkMode: boolean = false;
  @Input() userProfile: any; // Recebe dados do perfil
  
  // Dados padrão, usados apenas se userProfile não for fornecido

  public qrCodeUrl: string = 'https://dentistas.com.br/assets/qrcode_dentistascombr.png';
  googleMapsUrl: string = '';

 public endereco = {
    rua: 'Av. Paulista, 1000',
    complemento: 'Sala 501',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    telefone: '(11) 3456-7890',
    email: 'bia@dentistas.com.br',
    site: 'www.dentistas.com.br/bia'
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
}