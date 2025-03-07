import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contato.component.html', 
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent {

  constructor(public userService: UserService) { }

  
  // Métodos chamados no template HTML
  getTelefone(): string {
    return this.userService.userProfile.telefone || '';
  }
  
  getWhatsapp(): string {
    return this.userService.userProfile.whatsapp || '';
  }
  
  getEmail(): string {
    return this.userService.userProfile.email || '';
  }
}