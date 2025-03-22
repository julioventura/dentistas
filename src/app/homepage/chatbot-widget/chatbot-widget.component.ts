import { Component, HostListener, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // necessário para ngModel
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../../shared/user.service';
import { AiChatService, Message } from './ai-chat.service';

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
  @Input() dentistId: string = '';
  @Input() dentistName: string = '';

  // Estado de visualização do widget
  isMinimized = true;
  isMaximized = false;

  // Propriedades para o diálogo
  conversation: Message[] = [];
  userInput: string = '';
  waitingForName: boolean = true;  // Controla se estamos aguardando a resposta com o nome
  sessionId: string = ''; // Add this property
  isLoading: boolean = false; // Add this property

  constructor(
    private userService: UserService,
    private aiChatService: AiChatService // Add this service
  ) { }

  ngOnInit(): void {
    // Use dados do dentista do serviço se não fornecidos via Input
    if (!this.dentistId) {
      this.dentistId = this.userService.dentistId;
    }
    if (!this.dentistName) {
      this.dentistName = this.userService.dentistName;
    }
    
    this.userService.setChatbotExpanded(!this.isMinimized);
    
    // Criar uma nova sessão de chat
    this.aiChatService.createNewSession(this.dentistId).subscribe(
      sessionId => {
        this.sessionId = sessionId;
        // Envia a mensagem inicial
        this.addBotMessage("Olá! Qual é o seu nome?");
      }
    );
  }

  addBotMessage(message: string): void {
    const msg: Message = {
         content: message,
         sender: 'bot',
         timestamp: new Date()
    };
    this.conversation.push(msg);
    
    // Salva a mensagem no histórico
    if (this.sessionId) {
      this.aiChatService.saveMessageToHistory(this.sessionId, this.dentistId, msg)
        .subscribe();
    }
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
    
    const userMessage: Message = {
      content: this.userInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Adiciona mensagem do usuário à conversa
    this.conversation.push(userMessage);
    
    // Salva a mensagem do usuário no histórico
    if (this.sessionId) {
      this.aiChatService.saveMessageToHistory(this.sessionId, this.dentistId, userMessage)
        .subscribe();
    }
    
    const messageText = this.userInput;
    this.userInput = ''; // Limpa o input
    
    // Se estamos esperando o nome do usuário
    if (this.waitingForName) {
      this.waitingForName = false;
      this.addBotMessage(`Prazer em conhecê-lo, ${messageText}! Como posso ajudá-lo hoje?`);
      return;
    }
    
    // Mostra indicador de carregamento
    this.isLoading = true;
    
    // Chama o serviço de IA
    const context = { 
      dentistName: this.dentistName,
      conversation: this.conversation 
    };
    
    this.aiChatService.sendMessage(messageText, this.sessionId, this.dentistId, context)
      .subscribe({
        next: (response) => {
          // Adiciona resposta do bot à conversa
          this.conversation.push(response);
          // Salva a resposta do bot no histórico
          if (this.sessionId) {
            this.aiChatService.saveMessageToHistory(this.sessionId, this.dentistId, response)
              .subscribe();
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error getting response from AI', err);
          this.addBotMessage('Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente.');
          this.isLoading = false;
        }
      });
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
