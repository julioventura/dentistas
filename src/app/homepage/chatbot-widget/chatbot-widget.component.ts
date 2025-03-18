import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // necessário para ngModel
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../../shared/user.service';

// Interface de mensagem (pode estar em um arquivo separado, se preferir)
export interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.scss'],
  animations: [
    trigger('expandAnimation', [
      state('minimized', style({
        height: '50px',
        transform: 'translateY(0)',
        opacity: 1
      })),
      state('expanded', style({
        height: '*',
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('minimized => expanded', [
        style({ height: '50px', transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition('expanded => minimized', [
        animate('300ms ease-in', style({ height: '50px', transform: 'translateY(-20px)', opacity: 0 })),
        style({ height: '50px', transform: 'translateY(0)', opacity: 1 })
      ])
    ])
  ]
})
export class ChatbotWidgetComponent implements OnInit {

  dentistId!: string;
  dentistName!: string;
  
  // Estado de visualização do widget
  isMinimized = true;
  isMaximized = false;

  // Propriedades para o diálogo
  conversation: Message[] = [];
  userInput: string = '';
  waitingForName: boolean = true;  // Controla se estamos aguardando a resposta com o nome

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.dentistId = this.userService.dentistId;
    this.dentistName = this.userService.dentistName;
    this.userService.setChatbotExpanded(!this.isMinimized);
    // Envia a mensagem inicial
    this.addBotMessage("Olá! Qual é o seu nome?");
  }

  addBotMessage(message: string): void {
    const msg: Message = {
         content: message,
         sender: 'bot',
         timestamp: new Date()
    };
    this.conversation.push(msg);
  }

  addUserMessage(message: string): void {
    const msg: Message = {
         content: message,
         sender: 'user',
         timestamp: new Date()
    };
    this.conversation.push(msg);
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;
    const userMsg = this.userInput.trim();
    this.addUserMessage(userMsg);
    if (this.waitingForName) {
         // Primeira resposta: trata o valor como nome
         this.waitingForName = false;
         this.addBotMessage(`Olá, ${userMsg}! O chatbot estará disponível em alguns dias.`);
    } else {
         // Para as mensagens subsequentes
         this.addBotMessage("Estamos em obras. ;-)");
    }
    this.userInput = '';
  }

  toggleChat(): void {
    if (this.isMaximized) {
      this.isMaximized = false;
    }
    this.isMinimized = !this.isMinimized;
    this.userService.setChatbotExpanded(!this.isMinimized);
  }

  toggleMaximize(): void {
    if (!this.isMinimized) {
      this.isMaximized = !this.isMaximized;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    // Se necessário, implemente ajustes responsivos aqui.
  }
}
