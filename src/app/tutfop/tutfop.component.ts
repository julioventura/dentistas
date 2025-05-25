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
 * - injectTutfopScripts(): Injeta scripts JavaScript do TutFOP no DOM
 * - setupTutfopWithUserData(): Configura TutFOP com dados do usuário Angular
 * - getTutfopScriptContent(): Retorna conteúdo dos scripts adaptados do TutFOP
 * 
 * Constantes:
 * - userNome: Nome do usuário autenticado
 * - userEmail: Email do usuário autenticado  
 * - userUid: UID único do usuário autenticado
 * - isUserAuthenticated: Status de autenticação do usuário
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

  constructor(
    private userService: UserService,
    public util: UtilService,
  ) {}

  // ngOnInit(): Inicializa componente e subscreve dados do usuário
  ngOnInit(): void {
    // Subscrever aos dados do usuário
    this.userService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.userUid = user.uid;
          this.userEmail = user.email || '';
          this.userNome = user.displayName || this.userService.userProfile?.name || '';
          this.isUserAuthenticated = true;
          
          // Inicializar o TutFOP após obter os dados do usuário
          this.initializeTutfop();
        } else {
          this.isUserAuthenticated = false;
        }
      });
  }

  // ngOnDestroy(): Limpa subscriptions ao destruir componente
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // initializeTutfop(): Inicializa scripts e configurações do TutFOP
  private initializeTutfop(): void {
    // Aguardar o DOM estar pronto e então inicializar os scripts do TutFOP
    setTimeout(() => {
      this.injectTutfopScripts();
      this.setupTutfopWithUserData();
    }, 100);
  }

  // injectTutfopScripts(): Injeta scripts JavaScript do TutFOP no DOM
  private injectTutfopScripts(): void {
    // Injetar os scripts do TutFOP adaptados para usar dados do Angular
    const script = document.createElement('script');
    script.textContent = this.getTutfopScriptContent();
    document.head.appendChild(script);
  }

  // setupTutfopWithUserData(): Configura TutFOP com dados do usuário Angular
  private setupTutfopWithUserData(): void {
    // Configurar o TutFOP com os dados do usuário do Angular
    if ((window as any).initTutfopWithUser) {
      (window as any).initTutfopWithUser({
        nome: this.userNome,
        email: this.userEmail,
        uid: this.userUid
      });
    }
  }

  // getTutfopScriptContent(): Retorna conteúdo dos scripts adaptados do TutFOP
  private getTutfopScriptContent(): string {
    return `
      // TutFOP Script adaptado para Angular
      const webhookURLprod = 'https://jupiter.cirurgia.com.br/webhook/TutFOP_Teste';
      const webhookURLTest = 'https://marte.cirurgia.com.br/webhook-test/TutFOP_Teste';
      let webhookURL = webhookURLprod;
      let tutfopUserData = null;

      // initTutfopWithUser(): Inicializa TutFOP com dados do usuário Angular
      window.initTutfopWithUser = function(userData) {
        tutfopUserData = userData;
        console.log('TutFOP inicializado com dados do usuário:', userData);
        showChatInterface();
        updateUserInfo();
      };

      // showChatInterface(): Exibe interface do chat e oculta tela de login
      function showChatInterface() {
        const loginContainer = document.getElementById("tutfop-login-container");
        const chatContainer = document.getElementById("tutfop-chat-container");
        
        if (loginContainer) loginContainer.style.display = "none";
        if (chatContainer) chatContainer.style.display = "block";
      }

      // updateUserInfo(): Atualiza informações do usuário na interface
      function updateUserInfo() {
        const userInfo = document.getElementById("tutfop-user-info");
        if (userInfo && tutfopUserData) {
          userInfo.innerText = \`Usuário: \${tutfopUserData.nome} - \${tutfopUserData.email}\`;
        }
      }

      // sendTutfopMessage(): Envia mensagem do usuário para o tutor virtual
      window.sendTutfopMessage = async function() {
        const userInput = document.getElementById("tutfop-user-input");
        const chatLog = document.getElementById("tutfop-chat-log");
        const sendButton = document.getElementById("tutfop-send-button");

        if (!userInput || !chatLog) return;

        const message = userInput.value.trim();
        if (!message) {
          alert('Por favor, insira uma mensagem.');
          return;
        }

        // Adicionar mensagem do usuário
        const userMessage = \`<div class="user-message"><strong>Você:</strong> \${message}</div>\`;
        chatLog.innerHTML += userMessage;
        userInput.value = '';
        chatLog.scrollTop = chatLog.scrollHeight;

        // Desabilitar botão durante envio
        if (sendButton) {
          sendButton.disabled = true;
          sendButton.style.backgroundColor = "#bbb";
        }

        const data = {
          tipo: 'mensagem',
          mensagem: message,
          nome: tutfopUserData.nome,
          email: tutfopUserData.email,
          uid: tutfopUserData.uid
        };

        try {
          const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });

          const responseData = await response.json();

          if (responseData && responseData.response) {
            let formattedResponse = responseData.response.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>');
            formattedResponse = formattedResponse.replace(/\\n/g, '<br>');
            const botResponse = \`<div class="bot-message"><strong>Tutor Virtual:</strong> \${formattedResponse}</div>\`;
            chatLog.innerHTML += botResponse;
            chatLog.scrollTop = chatLog.scrollHeight;
          } else {
            alert('Erro ao processar mensagem. Tente novamente.');
          }
        } catch (error) {
          console.error('Erro ao enviar mensagem:', error);
          alert('Erro ao enviar mensagem. Tente novamente.');
        } finally {
          // Reabilitar botão
          if (sendButton) {
            sendButton.disabled = false;
            sendButton.style.backgroundColor = "#4CAF50";
          }
        }
      };

      // logoutTutfop(): Limpa chat
      window.logoutTutfop = function() {
        const confirmation = confirm("Confirma limpar a conversa?");
        if (confirmation) {
          const chatLog = document.getElementById("tutfop-chat-log");
          if (chatLog) chatLog.innerHTML = "";
        }
      };

      // Event listener para Enter no textarea - permite envio com Enter
      document.addEventListener('DOMContentLoaded', function() {
        const userInput = document.getElementById("tutfop-user-input");
        if (userInput) {
          userInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendTutfopMessage();
            }
          });
        }
      });
    `;
  }
}