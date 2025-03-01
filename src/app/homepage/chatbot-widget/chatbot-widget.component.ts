import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-widget" [class.minimized]="isMinimized">
      <!-- Botão flutuante quando minimizado -->
      <div class="chat-button" *ngIf="isMinimized" (click)="toggleChat()">
        <span>💬</span>
      </div>
      
      <!-- Container do chat quando expandido -->
      <div class="chat-container" *ngIf="!isMinimized">
        <div class="chat-header">
          <h3>Atendimento Virtual</h3>
          <button class="close-button" (click)="toggleChat()">✖</button>
        </div>
        
        <div class="chat-messages">
          <div class="message bot-message">
            <div class="message-content">
              Olá! Sou o assistente virtual do(a) {{dentistName}}. Como posso ajudar?
            </div>
          </div>
        </div>
        
        <div class="chat-input">
          <input 
            type="text" 
            [(ngModel)]="userInput" 
            placeholder="Digite sua mensagem..." 
            (keyup.enter)="sendMessage()" />
          <button (click)="sendMessage()">➤</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: Arial, sans-serif;
    }
    
    .chatbot-widget.minimized .chat-button {
      width: 60px;
      height: 60px;
      background-color: #0066cc;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .chatbot-widget.minimized .chat-button span {
      color: white;
      font-size: 24px;
    }
    
    .chat-container {
      width: 320px;
      height: 400px;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .chat-header {
      padding: 15px;
      background-color: #0066cc;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chat-header h3 {
      margin: 0;
      font-size: 16px;
    }
    
    .chat-header .close-button {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }
    
    .chat-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      background-color: #f5f5f5;
    }
    
    .message {
      margin-bottom: 10px;
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 20px;
    }
    
    .bot-message {
      background-color: #e8f4f8;
      color: #333;
      border-bottom-left-radius: 5px;
      align-self: flex-start;
    }
    
    .user-message {
      background-color: #0066cc;
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 5px;
      align-self: flex-end;
    }
    
    .chat-input {
      padding: 15px;
      display: flex;
      background-color: white;
      border-top: 1px solid #eee;
    }
    
    .chat-input input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 20px;
      outline: none;
    }
    
    .chat-input button {
      width: 40px;
      height: 40px;
      margin-left: 10px;
      background-color: #0066cc;
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
    }
  `]
})
export class ChatbotWidgetComponent implements OnInit {
  @Input() dentistId: string = '';
  @Input() dentistName: string = 'Dr(a).';
  
  messages: any[] = [];
  userInput: string = '';
  isMinimized: boolean = true;
  
  constructor() {}
  
  ngOnInit(): void {
    console.log('ChatbotWidget initialized with:', {
      dentistId: this.dentistId,
      dentistName: this.dentistName
    });
  }
  
  toggleChat(): void {
    this.isMinimized = !this.isMinimized;
    console.log('Chat toggled, isMinimized:', this.isMinimized);
  }
  
  sendMessage(): void {
    if (!this.userInput.trim()) return;
    
    console.log('Message sent:', this.userInput);
    
    // Adiciona mensagem do usuário
    this.messages.push({
      content: this.userInput,
      sender: 'user',
      timestamp: new Date()
    });
    
    // Resposta simulada do bot
    setTimeout(() => {
      this.messages.push({
        content: `Isso é uma resposta automática para: "${this.userInput}"`,
        sender: 'bot',
        timestamp: new Date()
      });
    }, 1000);
    
    this.userInput = '';
  }
}
