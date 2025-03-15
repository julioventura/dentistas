import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
export class ChatbotWidgetComponent implements OnInit {
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
  
  constructor() {
    console.log('ChatbotWidget constructor called');
  }
  
  ngOnInit(): void {
    console.log('ChatbotWidget initialized with dentistName:', this.dentistName);
    this.addBotMessage(`Olá! Qual o seu nome?`);
  }
  
  toggleChat(): void {
    this.isMinimized = !this.isMinimized;
    console.log('Chat toggled:', this.isMinimized ? 'minimized' : 'expanded');
    this.isExpanded = !this.isExpanded;
    this.expansionChange.emit(this.isExpanded);
  }
  
  minimizeChat(): void {
    this.isExpanded = false;
    this.expansionChange.emit(false);
  }
  
  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
    console.log('Chat fullscreen toggled:', this.isFullscreen ? 'fullscreen' : 'normal');
    this.scrollToBottom();
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
      
      this.addBotMessage(`Estarei pronto em alguns dias!  ;-)`);

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
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);
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
}
