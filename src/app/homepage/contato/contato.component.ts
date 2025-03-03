import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contato.component.html', 
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent {
  @Input() showIcon: boolean = true;
  @Input() darkMode: boolean = false;
  @Input() userProfile: any; // Recebe dados do perfil
  
  // Dados padrão de contato com valores preenchidos
  contato = {
    telefone: '(11) 3456-7890',
    whatsapp: '(11) 98765-4321',
    email: 'contato@dentistaapp.com.br'
  };
  
  // Métodos chamados no template HTML
  getTelefone(): string {
    return this.userProfile?.telefone || this.contato.telefone;
  }
  
  getWhatsapp(): string {
    return this.userProfile?.whatsapp || this.contato.whatsapp;
  }
  
  getEmail(): string {
    return this.userProfile?.email || this.contato.email;
  }
}