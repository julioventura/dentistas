import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { FormsModule } from '@angular/forms';  // necessário para ngModel
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../../shared/user.service';
import { AiChatService, Message, ChatContext } from './ai-chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ConfigService } from '../../shared/config.service';

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
  showContextIndicator = true;

  // Adicionar estas propriedades à classe
  // Controles para o popup de detalhes
  showDetailsPopup: boolean = false;
  isDetailsMaximized: boolean = false;
  detailsType: 'collection' | 'subcollection' = 'collection';
  detailsData: any = null;
  detailsTitle: string = 'Detalhes';

  constructor(
    private userService: UserService,
    public aiChatService: AiChatService, // Change to public
    private cdr: ChangeDetectorRef, // Injetar ChangeDetectorRef
    public configuracoes: ConfigService,
    private router: Router
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

    // Também subscrever diretamente ao contexto de navegação para debugging
    this.userService.navigationContext$
      .pipe(takeUntil(this.destroy$))
      .subscribe(navContext => {
        console.log('Navegação atual:', navContext);
      });

    // Inicializa a sessão do chat
    this.aiChatService.createNewSession(this.dentistId).subscribe(
      sessionId => {
        this.sessionId = sessionId;
        // Mensagem de boas-vindas
        this.addBotMessage("Olá! Como devo te chamar?");
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
      this.addBotMessage(`Prazer, ${messageText}! Como posso ajudar?`);
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
          this.addBotMessage('Tive um problema com a mensagem. Tente novamente.');
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
  formatCollectionName(collection?: string): string {
    if (!collection) return '';
    // Mapeamento de nomes de coleção para versões mais amigáveis
    const collectionNameMap: { [key: string]: string } = {
      'pacientes': 'Pacientes',
      'dentistas': 'Dentistas',
      'fornecedores': 'Fornecedores',
      'produtos': 'Produtos',
      'estoque': 'Estoque',
      'financeiro': 'Financeiro',
      'consultas': 'Consultas',
      'agendamentos': 'Agendamentos'
    };

    // Retorna o nome formatado ou capitaliza o original se não estiver no mapa
    return collectionNameMap[collection.toLowerCase()] ||
      this.capitalizeFirstLetter(collection);
  }

  /**
   * Formata o nome da subcoleção para exibição
   */
  formatSubcollectionName(subcollection?: string): string {
    if (!subcollection) return '';
    // Mapeamento de nomes de subcoleção para versões mais amigáveis
    const subcollectionNameMap: { [key: string]: string } = {
      'anamnese': 'Anamnese',
      'exames': 'Exames',
      'consultas': 'Consultas',
      'pagamentos': 'Pagamentos',
      'prontuario': 'Prontuário',
      'orcamentos': 'Orçamentos'
    };

    // Retorna o nome formatado ou capitaliza o original se não estiver no mapa
    return subcollectionNameMap[subcollection.toLowerCase()] ||
      this.capitalizeFirstLetter(subcollection);
  }

  /**
   * Formata o nome do registro para exibição
   */
  formatRecordName(name?: string): string {
    if (!name) return '';

    const maxLength = 25;
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  }

  /**
   * Formata o ID para exibição
   */
  formatId(id?: string): string {
    if (!id) return '';

    const maxLength = 8;
    return id.length > maxLength ? `${id.substring(0, 6)}...` : id;
  }

  /**
   * Capitaliza a primeira letra de uma string
   */
  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Verifica se estamos em uma view de subcollection
   */
  isSubcollectionView(): boolean {
    return this.currentContext?.currentView?.type === 'view-ficha' ||
      this.currentContext?.currentView?.type === 'edit-ficha';
  }

  /**
   * Verifica se a subcollection passada é a que estamos visualizando atualmente
   */
  isCurrentSubcollection(subcollection: string): boolean {
    if (!this.currentContext || !this.router.url) return false;

    // Verifica se a URL contém o nome desta subcollection
    return this.router.url.includes(`/fichas/${subcollection}/`);
  }

  /**
   * Obtém o nome do registro da subcollection quando disponível
   */
  getSubcollectionRecordName(): string | null {
    if (!this.isSubcollectionView() || !this.currentContext?.currentRecord?.data) {
      return null;
    }

    const data = this.currentContext.currentRecord.data;
    // Tentar vários possíveis nomes de campo
    return data.nome || data.title || data.titulo || null;
  }

  /**
   * Obtém o nome do registro principal, independente da visualização atual
   */
  getMainRecordName(): string {
    // Se estivermos em uma subcollection, buscar o nome do mainRecord de uma variável separada
    if (this.isSubcollectionView()) {
      // Essa informação deve vir de um campo que armazena o registro principal
      // Podemos usar o NavigationContext ou nossa hierarquia implementada
      const mainRecordData = this.aiChatService.getMainRecordData();
      if (mainRecordData?.nome) {
        return this.formatRecordName(mainRecordData.nome);
      }
    }

    // Caso contrário, usamos o registro atual normalmente
    return this.currentContext?.currentRecord?.data?.nome ?
      this.formatRecordName(this.currentContext.currentRecord.data.nome) : '';
  }

  /**
   * Verifica se estamos na visualização de list-fichas
   */
  isListFichasView(): boolean {
    return this.currentContext?.currentView?.type?.toLowerCase() === 'list-fichas';
  }

  // Método para mostrar/esconder o popup de detalhes da collection
  toggleCollectionDetails(): void {
    console.log('this.currentContext = ', this.currentContext);

    // Se já estiver mostrando detalhes da subcollection, feche
    if (this.showDetailsPopup && this.detailsType === 'subcollection') {
      this.showDetailsPopup = false;
      setTimeout(() => {
        this.showDetailsPopup = true;
        this.detailsType = 'collection';
        this.detailsData = this.aiChatService.getCurrentRecordData();
        this.detailsTitle = 'Detalhes: ' + this.currentContext?.currentRecord?.data?.nome;
      }, 300);
    } else {
      // Alternar visibilidade
      this.showDetailsPopup = !this.showDetailsPopup;

      if (this.showDetailsPopup) {
        this.detailsType = 'collection';
        this.detailsData = this.aiChatService.getCurrentRecordData();
        this.detailsTitle = 'Detalhes: ' + this.currentContext?.currentRecord?.data?.nome;
      }
    }
  }

  // Método para mostrar/esconder o popup de detalhes da subcollection
  toggleSubcollectionDetails(subcollection: string): void {
    // Se já estiver mostrando detalhes da collection, feche
    if (this.showDetailsPopup && this.detailsType === 'collection') {
      this.showDetailsPopup = false;
      setTimeout(() => {
        this.showDetailsPopup = true;
        this.detailsType = 'subcollection';
        this.detailsData = this.aiChatService.getLastSubcollectionRecord();
        this.detailsTitle = 'Ficha: ' + this.formatSubcollectionName(subcollection);
      }, 300);
    } else {
      // Alternar visibilidade
      this.showDetailsPopup = !this.showDetailsPopup;

      if (this.showDetailsPopup) {
        this.detailsType = 'subcollection';
        this.detailsData = this.aiChatService.getLastSubcollectionRecord();
        this.detailsTitle = 'Ficha: ' + this.formatSubcollectionName(subcollection);
      }
    }
  }

  // Método para maximizar/minimizar o popup de detalhes
  toggleDetailsMaximize(): void {
    this.isDetailsMaximized = !this.isDetailsMaximized;
  }

  // Método para formatar os dados de registro para exibição
  formatRecordDetailsForDisplay(data: any): { key: string, value: any }[] {
    if (!data) return [];

    return Object.entries(data)
      .filter(([key, value]) => {
        // Filtrar campos que são objetos complexos ou arrays
        return typeof value !== 'object' || value === null;
      })
      .map(([key, value]) => {
        // Formatar o nome do campo para exibição
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
          .replace(/([A-Z])/g, ' $1') // Adiciona espaço antes de letras maiúsculas
          .replace(/_/g, ' '); // Substitui underscores por espaços

        // Formatar valor para datas
        let formattedValue = value;
        if (value && typeof value === 'object') {
          // Usar type assertion para indicar ao TypeScript que pode ser um timestamp do Firestore
          const possibleTimestamp = value as { seconds?: number };
          if (possibleTimestamp.seconds) {
            // É um timestamp do Firestore
            formattedValue = new Date(possibleTimestamp.seconds * 1000).toLocaleDateString('pt-BR');
          }
        }

        return { key: formattedKey, value: formattedValue };
      })
      .sort((a, b) => a.key.localeCompare(b.key)); // Ordenar alfabeticamente
  }


  trackByKey(_key: string, item: any): any {
    return item.id; // ou outra propriedade única
  }
}
