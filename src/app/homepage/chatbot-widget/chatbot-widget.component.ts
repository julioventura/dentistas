import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
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
export class ChatbotWidgetComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private shouldScrollToBottom = true;
  private userScrolled = false;
  private lastScrollTop = 0;
  private scrollTimeout: any = null;

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
    this.userService.setChatbotExpanded(!this.isMinimized);

    // Criar uma nova sessão de chat
    this.aiChatService.createNewSession(this.userService.context.dentistId).subscribe(
      sessionId => {
        this.sessionId = sessionId;
        // Envia a mensagem inicial
        this.addBotMessage("Olá! Qual é o seu nome?");
      }
    );
  }

  ngAfterViewChecked() {
    // Só rola para o final se for uma nova mensagem e o usuário não estiver rolando
    if (this.shouldScrollToBottom && !this.userScrolled) {
      this.scrollToBottom();
    }
  }
  
  // Método para rolar para o final da conversa com delay para garantir que funcione após renderização
  scrollToBottom(): void {
    // Não rola se o usuário estiver visualizando mensagens antigas
    if (this.userScrolled) return;
    
    try {
      if (this.messagesContainer) {
        // Usa requestAnimationFrame para garantir que ocorra no próximo frame de renderização
        requestAnimationFrame(() => {
          const element = this.messagesContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        });
      }
    } catch (err) { 
      console.error('Erro ao tentar rolar para o final:', err); 
    }
  }

  get dentistId(): string {
    return this.userService.context.dentistId;
  }

  get dentistName(): string {
    return this.userService.context.dentistName;
  }

  get dentistLocation(): string {
    return this.userService.context.location;
  }

  get patientName(): string {
    return this.userService.context.patientName;
  }

  addBotMessage(message: string): void {
    const msg: Message = {
      content: message,
      sender: 'bot',
      timestamp: new Date()
    };
    this.conversation.push(msg);
    
    // Rola para o final apenas se o usuário não estiver visualizando mensagens anteriores
    if (!this.userScrolled) {
      this.shouldScrollToBottom = true;
    }

    // Salva a mensagem no histórico
    if(this.sessionId) {
      this.aiChatService.saveMessageToHistory(this.sessionId, this.dentistId, msg)
        .subscribe();
    }

    // Resetar o controle de rolagem quando uma nova mensagem for adicionada
    this.userScrolled = false;
    this.shouldScrollToBottom = true;
  }

  addUserMessage(message: string): void {
    const msg: Message = {
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    this.conversation.push(msg);
    this.shouldScrollToBottom = true;

    // Resetar o controle de rolagem quando uma nova mensagem for adicionada
    this.userScrolled = false;
    this.shouldScrollToBottom = true;
  }

  // Modificar sendMessage para garantir a rolagem após adicionar uma mensagem
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
      conversation: this.conversation,
      location: this.dentistLocation
    };

    this.aiChatService.sendMessage(messageText, this.sessionId, this.dentistId, context)
      .subscribe({
        next: (response) => {
          // Adiciona resposta do bot à conversa
          this.conversation.push(response);
          this.shouldScrollToBottom = true;
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

    // Defina que deve rolar para o fim
    this.shouldScrollToBottom = true;
    
    // Quando uma nova mensagem é enviada, voltamos a permitir a rolagem automática,
    // mesmo que o usuário tenha rolado anteriormente
    this.userScrolled = false;
    this.shouldScrollToBottom = true;
    
    // Chame o scroll manualmente também para garantir
    this.scrollToBottom();
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

  // Adicione também um detector de rolagem manual para não interferir com a interação do usuário
  onMessagesScroll(): void {
    if (!this.messagesContainer) return;
  
    const element = this.messagesContainer.nativeElement;
    const scrollTop = element.scrollTop;
    
    // Limpa o timeout anterior para evitar chamadas múltiplas
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    // Se o usuário está rolando para cima (scrollTop diminuindo)
    if (scrollTop < this.lastScrollTop) {
      this.userScrolled = true;
      this.shouldScrollToBottom = false;
    }
    
    // Verifica se chegou ao final da conversa
    const atBottom = element.scrollHeight - scrollTop - element.clientHeight < 30;
    if (atBottom) {
      // Espera um momento para garantir que não é um bounce da rolagem
      this.scrollTimeout = setTimeout(() => {
        this.userScrolled = false;
        this.shouldScrollToBottom = true;
      }, 200);
    }
    
    this.lastScrollTop = scrollTop;
  }

  ngAfterViewInit() {
    if (this.messagesContainer) {
      this.scrollToBottom();
      
      // Observa mudanças no tamanho do elemento
      if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
          if (!this.userScrolled) {
            this.scrollToBottom();
          }
        });
        
        resizeObserver.observe(this.messagesContainer.nativeElement);
      }
    }
  }
}
