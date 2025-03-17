import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface simples para as mensagens
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
  styleUrls: ['./chatbot-widget.component.scss']
})
export class ChatbotWidgetComponent implements OnInit, AfterViewInit {
  @Input() dentistId: string = '';
  @Input() dentistName: string = 'Dr(a).';
  
  @Output() expansionChange = new EventEmitter<boolean>();
  
  messages: Message[] = [];
  userInput: string = '';
  isMinimized: boolean = true;
  isBotTyping: boolean = false;
  isFullscreen: boolean = false;
  isExpanded: boolean = false;
  isFirstUserMessage: boolean = true; // Flag para controlar a primeira mensagem
  
  // Para usar no template
  console = console;
  
  constructor() {
    console.log('ChatbotWidget constructor called');
  }
  
  ngOnInit(): void {
    console.log('ChatbotWidget initialized with dentistName:', this.dentistName);
    this.addBotMessage(`Olá! Qual o seu nome?`);
  }
  
  ngAfterViewInit(): void {
    // Observa mudanças no conteúdo do chat para manter o scroll na posição correta
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      const observer = new MutationObserver(() => {
        this.scrollToBottom();
      });
      
      observer.observe(chatContainer, {
        childList: true,
        subtree: true
      });
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustChatPosition();
  }
  
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.isFullscreen) {
      this.toggleFullscreen(); // Usar o método toggle para garantir a consistência
    }
  }
  
  toggleChat(): void {
    this.isMinimized = !this.isMinimized;
    console.log('Chat toggled:', this.isMinimized ? 'minimized' : 'expanded');
    this.isExpanded = !this.isExpanded;
    this.expansionChange.emit(this.isExpanded);
    
    // Ajusta a posição após alternar o estado
    if (!this.isMinimized) {
      setTimeout(() => this.adjustChatPosition(), 0);
    }
  }
  
  minimizeChat(): void {
    this.isExpanded = false;
    this.expansionChange.emit(false);
  }
  
  toggleFullscreen(): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  
    this.isFullscreen = !this.isFullscreen;
    console.log('Fullscreen toggled:', this.isFullscreen);
  
    if (this.isFullscreen) {
      // Remover qualquer instância anterior do container fullscreen
      const existingFullscreen = document.getElementById('chatbot-fullscreen-container');
      if (existingFullscreen) {
        document.body.removeChild(existingFullscreen);
      }
      
      // Criar um novo elemento para o fullscreen
      const fullscreenEl = document.createElement('div');
      fullscreenEl.id = 'chatbot-fullscreen-container';
      
      // Aplicar estilos diretamente no elemento (para garantir que sejam aplicados)
      fullscreenEl.style.position = 'fixed';
      fullscreenEl.style.top = '0';
      fullscreenEl.style.left = '0';
      fullscreenEl.style.right = '0';
      fullscreenEl.style.bottom = '0';
      fullscreenEl.style.width = '100vw';
      fullscreenEl.style.height = '100vh';
      fullscreenEl.style.backgroundColor = '#0006';
      fullscreenEl.style.zIndex = '9999';
      fullscreenEl.style.overflow = 'hidden';
      fullscreenEl.style.display = 'flex';
      fullscreenEl.style.flexDirection = 'column';
      fullscreenEl.style.alignItems = 'center';
      fullscreenEl.style.justifyContent = 'center';
      fullscreenEl.style.padding = '50px';
      fullscreenEl.style.boxSizing = 'border-box';
      fullscreenEl.style.fontSize = '16px';
      
      // Criar a estrutura do chat em tela cheia
      const chatContentEl = document.createElement('div');
      chatContentEl.className = 'chat-content';
      chatContentEl.style.display = 'flex';
      chatContentEl.style.flexDirection = 'column';
      chatContentEl.style.height = 'calc(100% - 40px)';
      chatContentEl.style.width = '90%';
      chatContentEl.style.maxWidth = '1200px';
      chatContentEl.style.margin = '0 auto';
      chatContentEl.style.borderRadius = '10px';
      chatContentEl.style.overflow = 'hidden';
      chatContentEl.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
      chatContentEl.style.backgroundColor = 'white';
      
      // Cabeçalho
      const headerEl = document.createElement('div');
      headerEl.className = 'chat-fullscreen-header';
      headerEl.style.display = 'flex';
      headerEl.style.justifyContent = 'space-between';
      headerEl.style.alignItems = 'center';
      headerEl.style.padding = '15px 20px';
      headerEl.style.backgroundColor = '#4a67de';
      headerEl.style.color = 'white';
      
      const titleEl = document.createElement('div');
      titleEl.className = 'chat-title';
      titleEl.textContent = 'Assistente Virtual de I.A.';
      titleEl.style.fontSize = '18px';
      titleEl.style.fontWeight = 'bold';
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'chat-exit-fullscreen-btn';
      closeBtn.textContent = 'Sair da Tela Cheia';
      closeBtn.style.padding = '8px 15px';
      closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      closeBtn.style.color = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '5px';
      closeBtn.style.fontSize = '14px';
      closeBtn.style.cursor = 'pointer';
      
      closeBtn.addEventListener('click', () => this.toggleFullscreen());
      
      headerEl.appendChild(titleEl);
      headerEl.appendChild(closeBtn);
      
      // Área de mensagens
      const messagesEl = document.createElement('div');
      messagesEl.className = 'chat-fullscreen-messages';
      messagesEl.style.flex = '1';
      messagesEl.style.display = 'flex';
      messagesEl.style.flexDirection = 'column';
      messagesEl.style.overflowY = 'auto';
      messagesEl.style.padding = '20px';
      messagesEl.style.backgroundColor = '#f5f5f5';
      
      // Copiar mensagens existentes
      this.messages.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = `message ${msg.sender}`;
        msgEl.style.display = 'flex';
        msgEl.style.flexDirection = 'column';
        msgEl.style.marginBottom = '15px';
        msgEl.style.padding = '12px 15px';
        msgEl.style.borderRadius = '18px';
        msgEl.style.maxWidth = '80%';
        
        if (msg.sender === 'user') {
          msgEl.style.alignSelf = 'flex-end';
          msgEl.style.backgroundColor = '#4a67de';
          msgEl.style.color = 'white';
          msgEl.style.marginLeft = 'auto';
        } else {
          msgEl.style.alignSelf = 'flex-start';
          msgEl.style.backgroundColor = '#ffffff';
          msgEl.style.color = '#333';
          msgEl.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
        
        const contentEl = document.createElement('div');
        contentEl.className = 'message-content';
        contentEl.textContent = msg.content;
        contentEl.style.marginBottom = '5px';
        
        const timeEl = document.createElement('div');
        timeEl.className = 'message-time';
        timeEl.textContent = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        timeEl.style.fontSize = '12px';
        timeEl.style.color = msg.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)';
        timeEl.style.textAlign = 'right';
        
        msgEl.appendChild(contentEl);
        msgEl.appendChild(timeEl);
        messagesEl.appendChild(msgEl);
      });
      
      // Área de input
      const inputContainerEl = document.createElement('div');
      inputContainerEl.className = 'chat-fullscreen-input-container';
      inputContainerEl.style.display = 'flex';
      inputContainerEl.style.padding = '15px 20px';
      inputContainerEl.style.backgroundColor = 'white';
      inputContainerEl.style.borderTop = '1px solid #e0e0e0';
      
      const inputEl = document.createElement('input');
      inputEl.type = 'text';
      inputEl.className = 'chat-input';
      inputEl.placeholder = 'Digite sua mensagem...';
      inputEl.style.flex = '1';
      inputEl.style.padding = '12px 15px';
      inputEl.style.border = '1px solid #ddd';
      inputEl.style.borderRadius = '20px';
      inputEl.style.fontSize = '16px';
      inputEl.style.outline = 'none';
      
      const sendBtn = document.createElement('button');
      sendBtn.className = 'chat-send-btn';
      sendBtn.textContent = 'Enviar';
      sendBtn.style.marginLeft = '10px';
      sendBtn.style.padding = '10px 20px';
      sendBtn.style.backgroundColor = '#4a67de';
      sendBtn.style.color = 'white';
      sendBtn.style.border = 'none';
      sendBtn.style.borderRadius = '20px';
      sendBtn.style.fontSize = '16px';
      sendBtn.style.cursor = 'pointer';
      
      // Handler para enviar mensagem
      const sendMessage = () => {
        if (inputEl.value.trim()) {
          this.userInput = inputEl.value;
          this.sendMessage();
          inputEl.value = '';
          
          // Atualizar mensagens no fullscreen após enviar
          setTimeout(() => {
            // Limpar e recriar mensagens
            messagesEl.innerHTML = '';
            this.messages.forEach(msg => {
              const msgEl = document.createElement('div');
              msgEl.className = `message ${msg.sender}`;
              msgEl.style.display = 'flex';
              msgEl.style.flexDirection = 'column';
              msgEl.style.marginBottom = '15px';
              msgEl.style.padding = '12px 15px';
              msgEl.style.borderRadius = '18px';
              msgEl.style.maxWidth = '80%';
              
              if (msg.sender === 'user') {
                msgEl.style.alignSelf = 'flex-end';
                msgEl.style.backgroundColor = '#4a67de';
                msgEl.style.color = 'white';
                msgEl.style.marginLeft = 'auto';
              } else {
                msgEl.style.alignSelf = 'flex-start';
                msgEl.style.backgroundColor = '#ffffff';
                msgEl.style.color = '#333';
                msgEl.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }
              
              const contentEl = document.createElement('div');
              contentEl.className = 'message-content';
              contentEl.textContent = msg.content;
              contentEl.style.marginBottom = '5px';
              
              const timeEl = document.createElement('div');
              timeEl.className = 'message-time';
              timeEl.textContent = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
              timeEl.style.fontSize = '12px';
              timeEl.style.color = msg.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)';
              timeEl.style.textAlign = 'right';
              
              msgEl.appendChild(contentEl);
              msgEl.appendChild(timeEl);
              messagesEl.appendChild(msgEl);
            });
            
            // Scroll para o fim
            messagesEl.scrollTop = messagesEl.scrollHeight;
          }, 1100);
        }
      };
      
      sendBtn.addEventListener('click', sendMessage);
      inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
      
      // Montar a estrutura completa
      inputContainerEl.appendChild(inputEl);
      inputContainerEl.appendChild(sendBtn);
      
      chatContentEl.appendChild(headerEl);
      chatContentEl.appendChild(messagesEl);
      chatContentEl.appendChild(inputContainerEl);
      
      fullscreenEl.appendChild(chatContentEl);
      
      // Esconder o chatbot original
      const chatContainer = document.querySelector('.chatbot-container');
      if (chatContainer) (chatContainer as HTMLElement).style.display = 'none';
      
      // Adicionar o fullscreen ao body
      document.body.appendChild(fullscreenEl);
      
      // Focar no input
      setTimeout(() => inputEl.focus(), 100);
      
      // Scroll para o fim
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } else {
      // Remover o elemento fullscreen
      const fullscreenEl = document.getElementById('chatbot-fullscreen-container');
      if (fullscreenEl) document.body.removeChild(fullscreenEl);
      
      // Mostrar o chatbot normal novamente
      const chatContainer = document.querySelector('.chatbot-container');
      if (chatContainer) (chatContainer as HTMLElement).style.display = 'flex';
      
      // Atualizar o scroll do chat normal
      this.scrollToBottom();
    }
  }
  
  sendMessage(): void {
    if (!this.userInput.trim()) return;
    
    // Adiciona mensagem do usuário
    const userMessage: Message = {
      content: this.userInput,
      sender: 'user',
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    this.scrollToBottom(); // Rolando após adicionar a mensagem do usuário
    
    const userText = this.userInput;
    this.userInput = ''; // Limpar input
    
    // Simula resposta do bot
    this.isBotTyping = true;
    
    setTimeout(() => {
      this.isBotTyping = false;
      
      // Apenas exibe a saudação personalizada na primeira mensagem
      if (this.isFirstUserMessage) {
        this.addBotMessage(`Olá ${userText}!`);
        this.isFirstUserMessage = false;
      }
      
      this.addBotMessage(`Obrigado por testar! Tente novamente em alguns dias!  ;-)`);

      // Log do histórico
      this.logConversationHistory();
    }, 1000);
  }
  
  private addBotMessage(content: string): void {
    this.messages.push({
      content: content,
      sender: 'bot',
      timestamp: new Date()
    });
    
    this.scrollToBottom();
  }
  
  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        // Usando behavior: 'smooth' para uma transição mais agradável quando novas mensagens chegam
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100); // Aumentando um pouco o timeout para garantir que o DOM foi atualizado
  }
  
  logConversationHistory(): void {
    console.log('===== CONVERSATION HISTORY =====');
    console.log(`Total messages: ${this.messages.length}`);
    
    this.messages.forEach((msg, index) => {
      const time = msg.timestamp.toLocaleTimeString();
      console.log(`[${index + 1}] [${time}] ${msg.sender.toUpperCase()}: ${msg.content}`);
    });
    
    console.log('===============================');
  }

  private adjustChatPosition(): void {
    // Se estiver em fullscreen, não precisamos ajustar
    if (this.isFullscreen) return;
    
    const chatContainer = document.querySelector('.chatbot-container') as HTMLElement;
    if (!chatContainer) return;
    
    // Resetar posição personalizada que pode ter sido definida
    if (this.isMinimized) {
      chatContainer.style.position = 'fixed';
      chatContainer.style.bottom = '20px';
      chatContainer.style.right = '20px';
      chatContainer.style.top = 'auto';
      return;
    }
    
    const viewportHeight = window.innerHeight;
    const chatHeight = chatContainer.offsetHeight;
    const chatRect = chatContainer.getBoundingClientRect();
    
    // Verifica se o chat está extrapolando o topo da tela
    if (chatRect.top < 20) {
      chatContainer.style.bottom = 'auto';
      chatContainer.style.top = '20px';
    }
    
    // Verifica se o chat está extrapolando o fundo da tela
    if (chatRect.bottom > viewportHeight - 20) {
      chatContainer.style.top = 'auto';
      chatContainer.style.bottom = '20px';
    }
    
    // Garante que o chat esteja visível horizontalmente
    if (chatRect.right > window.innerWidth - 20) {
      chatContainer.style.right = '20px';
    }
  }
}
