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
  googleMapsUrl: string = '';

 
  constructor(public userService: UserService) { }

  
  getEnderecoCompleto(): string {
    if (this.userService.userProfile) {
        console.log("userService.userProfile:", this.userService.userProfile);

      return `${this.userService.userProfile.endereco}, ${this.userService.userProfile.cidade} - ${this.userService.userProfile.estado}`;
    }
    return `${this.userService.userProfile.endereco.rua}, ${this.userService.userProfile.endereco.complemento} - ${this.userService.userProfile.endereco.bairro}`;
  }
  
  getCidadeEstadoCep(): string {
    if (this.userService.userProfile) {
      return `${this.userService.userProfile.cidade} - ${this.userService.userProfile.estado}, CEP ${this.userService.userProfile.cep}`;
    }
    else {
      return '';
    }
  }
}