/**
 * Componente TutFOP - Tutor Virtual de Casos Clínicos
 * 
 * Funcionalidade: Integra o chatbot TutFOP ao sistema Angular, usando autenticação 
 * existente e permitindo conversas com tutor virtual de casos clínicos.
 * 
 * Funções principais:
 * - ngOnInit(): Inicializa componente e subscreve dados do usuário
 * - ngOnDestroy(): Limpa subscriptions ao destruir componente
 * - initializeTutfop(): Inicializa scripts e configurações do TutFOP
 * - showChatInterface(): Exibe interface do chat e oculta tela de login
 * - updateUserInfo(): Atualiza informações do usuário na interface
 * - sendTutfopMessage(): Envia mensagem do usuário para o tutor virtual
 * - logoutTutfop(): Limpa chat
 * - setupEventListeners(): Configura listeners para eventos do DOM
 * 
 * Constantes:
 * - userNome: Nome do usuário autenticado
 * - userEmail: Email do usuário autenticado  
 * - userUid: UID único do usuário autenticado
 * - isUserAuthenticated: Status de autenticação do usuário
 * - webhookURL: URL do webhook para comunicação com TutFOP
 */

import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../shared/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '../shared/utils/util.service';

@Component({
  selector: 'app-tutfop',
  templateUrl: './tutfop.component.html',
  styleUrls: ['./tutfop.component.scss'],
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None // Para permitir que os estilos do TutFOP funcionem
})
export class TutfopComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  userNome: string = '';
  userEmail: string = '';
  userUid: string = '';
  isUserAuthenticated: boolean = false;

  private readonly webhookURLprod = 'https://marte.cirurgia.com.br/webhook/TutFOP3';
  private webhookURL = this.webhookURLprod;
  
  // private readonly webhookURLteste = 'https://marte.cirurgia.com.br/webhook-test/TutFOP3';
//   private webhookURL = this.webhookURLprod;

  constructor(
    private userService: UserService,
    public util: UtilService,
  ) {
    console.log("TutfopComponent.constructor()");
  }

  // ngOnInit(): Inicializa componente e subscreve dados do usuário
  ngOnInit(): void {
    console.log("TutfopComponent.ngOnInit()");
    // Subscrever aos dados do usuário
    this.userService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.userUid = user.uid;
          this.userEmail = user.email || '';
          this.userNome = user.displayName || this.userService.userProfile?.nome || '';
          this.isUserAuthenticated = true;
          
          console.log('Nome: ',this.userNome);
          console.log('displayName: ',user.displayName);
          console.log('userProfile.nome: ',this.userService.userProfile?.nome);
          
          // Inicializar o TutFOP após obter os dados do usuário
          this.initializeTutfop();
        } else {
          this.isUserAuthenticated = false;
        }
      });
  }

  // ngOnDestroy(): Limpa subscriptions ao destruir componente
  ngOnDestroy(): void {
    console.log("TutfopComponent.ngOnDestroy()");
    this.destroy$.next();
    this.destroy$.complete();
  }

  // initializeTutfop(): Inicializa scripts e configurações do TutFOP
  private initializeTutfop(): void {
    console.log("TutfopComponent.initializeTutfop()");
    console.log('TutFOP inicializado com dados do usuário:', {
      nome: this.userNome,
      email: this.userEmail,
      uid: this.userUid
    });
    
    // Aguardar o DOM estar pronto e então inicializar
    setTimeout(() => {
      this.showChatInterface();
      this.updateUserInfo();
      this.setupEventListeners();
    }, 100);
  }

  // showChatInterface(): Exibe interface do chat e oculta tela de login
  private showChatInterface(): void {
    console.log("TutfopComponent.showChatInterface()");
    const loginContainer = document.getElementById("tutfop-login-container");
    const chatContainer = document.getElementById("tutfop-chat-container");
    
    if (loginContainer) loginContainer.style.display = "none";
    if (chatContainer) chatContainer.style.display = "block";
  }

  // updateUserInfo(): Atualiza informações do usuário na interface
  private updateUserInfo(): void {
    console.log("TutfopComponent.updateUserInfo()");
    const userInfo = document.getElementById("tutfop-user-info");
    if (userInfo) {
      userInfo.innerText = `Usuário: ${this.userNome} - ${this.userEmail}`;
    }
  }

  // sendTutfopMessage(): Envia mensagem do usuário para o tutor virtual
  async sendTutfopMessage(): Promise<void> {
    console.log("TutfopComponent.sendTutfopMessage()");
    const userInput = document.getElementById("tutfop-user-input") as HTMLTextAreaElement;
    const chatLog = document.getElementById("tutfop-chat-log");
    const sendButton = document.getElementById("tutfop-send-button") as HTMLButtonElement;

    if (!userInput || !chatLog) return;

    const message = userInput.value.trim();
    if (!message) {
      alert('Por favor, insira uma mensagem.');
      return;
    }

    // LOG: Clique no botão Enviar - início do envio da mensagem
    console.log('[TutFOP][Webhook][FASE 0][CLICK] Botão "Enviar" clicado.');
    console.log('[TutFOP][Webhook][FASE 0][CLICK] Mensagem digitada:', message);

    // Adicionar mensagem do usuário
    const userMessage = `<div class="user-message"><strong>Você:</strong> ${message}</div>`;
    chatLog.innerHTML += userMessage;
    userInput.value = '';
    chatLog.scrollTop = chatLog.scrollHeight;

    // Desabilitar botão durante envio
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.style.backgroundColor = "#bbb";
    }

    // Dados a serem enviados ao webhook
    const data = {
      tipo: 'mensagem',
      mensagem: message,
      nome: this.userNome,
      email: this.userEmail,
      uid: this.userUid
    };

    // LOG: Fase 1 - Preparação dos dados para envio ao webhook
    console.log('[TutFOP][Webhook][FASE 1][PREPARO] Dados preparados para envio:', data);
    console.log('[TutFOP][Webhook][FASE 1][PREPARO] Lista de campos e valores:');
    Object.keys(data).forEach((campo) => {
      console.log(`  ${campo}:`, (data as any)[campo]);
    });

    // LOG: Fase 2 - Envio da requisição para o webhook
    console.log('[TutFOP][Webhook][FASE 2][ENVIO] Enviando requisição POST para:', this.webhookURL);
    console.log('[TutFOP][Webhook][FASE 2][ENVIO] Payload JSON:', JSON.stringify(data));
    console.log('[TutFOP][Webhook][FASE 2][ENVIO] Formato do envio: application/json');

    try {
      const response = await fetch(this.webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // LOG: Fase 3 - Resposta recebida do webhook
      console.log('[TutFOP][Webhook][FASE 3][RESPOSTA] Status HTTP:', response.status);

      let responseData: any = null;
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();

      // LOG: Fase 3 - Conteúdo bruto recebido
      console.log('[TutFOP][Webhook][FASE 3][RESPOSTA] Conteúdo bruto recebido:', responseText);

      if (contentType && contentType.includes('application/json') && responseText) {
        try {
          responseData = JSON.parse(responseText);
          // LOG: Fase 3 - JSON parse OK
          console.log('[TutFOP][Webhook][FASE 3][RESPOSTA] JSON parse bem-sucedido:', responseData);
        } catch (e) {
          // LOG: Fase 3 - Erro ao fazer parse do JSON
          console.error('[TutFOP][Webhook][FASE 3][ERRO] Falha ao fazer parse do JSON:', e, responseText);
        }
      } else {
        // LOG: Fase 3 - Resposta não é JSON ou está vazia
        console.warn('[TutFOP][Webhook][FASE 3][AVISO] Resposta não é JSON ou está vazia.', { contentType, responseText });
      }

      // LOG: Fase 4 - Conferência dos campos esperados na resposta
      console.log('[TutFOP][Webhook][FASE 4][CONFERENCIA] Campos esperados na resposta: ["response"]');
      console.log('[TutFOP][Webhook][FASE 4][CONFERENCIA] Dados recebidos:', responseData);

      if (responseData && responseData.response) {
        let formattedResponse = responseData.response.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        formattedResponse = formattedResponse.replace(/\n/g, '<br>');
        const botResponse = `<div class="bot-message"><strong>Tutor Virtual:</strong> ${formattedResponse}</div>`;
        chatLog.innerHTML += botResponse;
        chatLog.scrollTop = chatLog.scrollHeight;
      } else {
        alert('Erro ao processar mensagem. Tente novamente.');
        // LOG: Fase 4 - Erro de campos não recebidos
        console.error('[TutFOP][Webhook][FASE 4][ERRO] Campo "response" não recebido do webhook.', responseData);
      }
    } catch (error) {
      // LOG: Fase 5 - Erro na conexão ou processamento
      console.error('[TutFOP][Webhook][FASE 5][ERRO] Falha na conexão ou processamento do webhook:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      // Reabilitar botão
      if (sendButton) {
        sendButton.disabled = false;
        sendButton.style.backgroundColor = "#4CAF50";
      }
    }
  }

  // logoutTutfop(): Limpa chat
  logoutTutfop(): void {
    console.log("TutfopComponent.logoutTutfop()");
    const confirmation = confirm("Confirma limpar a conversa?");
    if (confirmation) {
      const chatLog = document.getElementById("tutfop-chat-log");
      if (chatLog) chatLog.innerHTML = "";
    }
  }

  // setupEventListeners(): Configura listeners para eventos do DOM
  private setupEventListeners(): void {
    console.log("TutfopComponent.setupEventListeners()");
    const userInput = document.getElementById("tutfop-user-input") as HTMLTextAreaElement;
    if (userInput) {
      userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          this.sendTutfopMessage();
        }
      });
    }
  }
}