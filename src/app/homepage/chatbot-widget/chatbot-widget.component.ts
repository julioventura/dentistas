import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewChecked, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // necessário para ngModel
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../../shared/user.service';
import { AiChatService, Message, ChatContext } from './ai-chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class ChatbotWidgetComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  
  // Adicionar subject para unsubscribe ao destruir o componente
  private destroy$ = new Subject<void>();

  // Propriedades básicas do chatbot
  isMinimized = true;
  isMaximized = false;
  conversation: Message[] = [];
  userInput = '';
  isLoading = false;
  sessionId = '';
  dentistId = '';
  waitingForName = true;
  shouldScrollToBottom = false;
  isScrolledToBottom = true;
  
  // Propriedades do contexto
  dentistName = '';
  dentistLocation = '';
  patientName = '';
  currentContext: ChatContext | null = null;
  showContextIndicator = false;

  constructor(
    private userService: UserService,
    private aiChatService: AiChatService,
    private cdr: ChangeDetectorRef // Injetar ChangeDetectorRef
  ) { }

  // Atualizar o método ngOnInit para se inscrever nas atualizações de contexto

  ngOnInit(): void {
    // Configuração inicial
    this.dentistId = this.userService.context?.dentistId || '';
    this.dentistName = this.userService.context?.dentistName || '';
    this.dentistLocation = this.userService.context?.location || '';
    this.patientName = this.userService.context?.patientName || '';
    
    // Seta o estado para o UserService
    this.userService.setChatbotExpanded(!this.isMinimized);
    
    // Inscrever-se nas atualizações de contexto
    this.aiChatService.context$
      .pipe(takeUntil(this.destroy$))
      .subscribe(context => {
        console.log('Chatbot atualizou contexto:', context);
        this.currentContext = context;
        this.cdr.detectChanges(); // Forçar detecção de mudanças
      });

    // Inicializa a sessão do chat
    this.aiChatService.createNewSession(this.dentistId).subscribe(
      sessionId => {
        this.sessionId = sessionId;
        // Mensagem de boas-vindas
        this.addBotMessage("Olá! Como posso ajudar hoje?");
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      this.scrollToBottom();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && this.messagesContainer && this.messagesContainer.nativeElement) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  // Importante: implementar OnDestroy para evitar memory leaks
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para enviar mensagem do usuário
  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userMessage: Message = {
      content: this.userInput,
      sender: 'user',
      timestamp: new Date()
    };

    // Adiciona mensagem do usuário à conversa
    this.conversation.push(userMessage);
    this.shouldScrollToBottom = true;

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

    // Atualiza o contexto antes de enviar
    this.currentContext = this.aiChatService.getCurrentContext();

    // Chama o serviço de IA com contexto ampliado
    const context = {
      dentistName: this.dentistName,
      conversation: this.conversation,
      location: this.dentistLocation,
      patientName: this.patientName,
      currentContext: this.currentContext
    };

    this.aiChatService.sendMessage(messageText, this.sessionId, this.dentistId, context)
      .subscribe({
        next: (response) => {
          // Adiciona resposta do bot à conversa
          this.conversation.push(response);
          this.shouldScrollToBottom = true;
          
          // Salva a resposta no histórico
          if (this.sessionId) {
            this.aiChatService.saveMessageToHistory(this.sessionId, this.dentistId, response)
              .subscribe();
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao obter resposta da IA', err);
          this.addBotMessage('Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente.');
          this.isLoading = false;
        }
      });
  }

  // Helper para adicionar mensagem do bot
  addBotMessage(content: string): void {
    const botMessage: Message = {
      content,
      sender: 'bot',
      timestamp: new Date()
    };
    this.conversation.push(botMessage);
    this.shouldScrollToBottom = true;
    
    // Salvar no histórico se temos uma sessão
    if (this.sessionId) {
      this.aiChatService.saveMessageToHistory(this.sessionId, this.dentistId, botMessage)
        .subscribe();
    }
  }

  // Métodos para controlar a exibição do chatbot
  // Método para alternar entre minimizado e expandido
  toggleChat(): void {
    // Se estiver maximizado, primeiro desmaximar, depois minimizar
    if (this.isMaximized && !this.isMinimized) {
      this.isMaximized = false;
      
      // Pequeno timeout para garantir que a transição de desmaximizar ocorra primeiro
      setTimeout(() => {
        this.isMinimized = true;
        this.userService.setChatbotExpanded(false);
      }, 50);
    } else {
      this.isMinimized = !this.isMinimized;
      this.userService.setChatbotExpanded(!this.isMinimized);
      
      if (this.isMinimized) {
        this.isMaximized = false; // Se minimizar, garantir que não esteja maximizado
      }
    }
    
    // Rolar para o final das mensagens se expandir
    if (!this.isMinimized) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  }

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  // Toggle para mostrar/ocultar indicador de contexto
  toggleContextIndicator(): void {
    this.showContextIndicator = !this.showContextIndicator;
  }

  // Controle de rolagem
  scrollToBottom(): void {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      try {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Erro ao rolar para o final:', err);
      }
    }
  }

  onMessagesScroll(): void {
    if (!this.messagesContainer || !this.messagesContainer.nativeElement) return;
    
    const element = this.messagesContainer.nativeElement;
    const atBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50;
    this.isScrolledToBottom = atBottom;
  }

  /**
   * Formata o nome da coleção para exibição
   */
  formatCollectionName(collection: string): string {
    // Mapeamento de nomes de coleção para versões mais amigáveis
    const collectionNameMap: {[key: string]: string} = {
      'pacientes': 'Pacientes',
      'dentistas': 'Dentistas',
      'fornecedores': 'Fornecedores',
      'produtos': 'Produtos',
      'estoque': 'Estoque',
      'financeiro': 'Financeiro',
      'tratamentos': 'Tratamentos',
      'agendamentos': 'Agendamentos'
    };

    // Retorna o nome formatado ou capitaliza o original se não estiver no mapa
    return collectionNameMap[collection.toLowerCase()] || 
           this.capitalizeFirstLetter(collection);
  }

  /**
   * Formata o nome da subcoleção para exibição
   */
  formatSubcollectionName(subcollection: string): string {
    // Mapeamento de nomes de subcoleção para versões mais amigáveis
    const subcollectionNameMap: {[key: string]: string} = {
      'anamnese': 'Anamnese',
      'exames': 'Exames',
      'tratamentos': 'Tratamentos',
      'pagamentos': 'Pagamentos',
      'prontuario': 'Prontuário',
      'orcamentos': 'Orçamentos',
      'consultas': 'Consultas'
    };

    // Retorna o nome formatado ou capitaliza o original se não estiver no mapa
    return subcollectionNameMap[subcollection.toLowerCase()] || 
           this.capitalizeFirstLetter(subcollection);
  }

  /**
   * Capitaliza a primeira letra de uma string
   */
  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
