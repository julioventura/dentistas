import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { environment } from '../../../environments/environment';

export interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  dentistId: string;
  messages: Message[];
  startedAt: Date;
  lastMessageAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private apiUrl = environment.aiChatApiUrl;
  private fallbackResponses = [
    "Desculpe, não consegui processar sua solicitação no momento. Como posso ajudar de outra forma?",
    "Estou com dificuldades para responder sua pergunta. Podemos tentar novamente?",
    "Parece que tive um problema ao buscar essa informação. Posso ajudar com outra questão sobre odontologia?"
  ];
  
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore
  ) {}

  /**
   * Envia uma mensagem para a API de IA e retorna a resposta
   */
  sendMessage(message: string, sessionId: string, dentistId: string, context?: any): Observable<Message> {
    console.log('Sending message:', message, 'for session:', sessionId);
    const botResponse: Message = {
      content: `Resposta automática para: "${message}"`,
      sender: 'bot',
      timestamp: new Date()
    };
    return of(botResponse).pipe(delay(1000));
  }

  /**
   * Salva a mensagem no histórico do Firestore
   */
  saveMessageToHistory(sessionId: string, dentistId: string, message: Message): Observable<void> {
    console.log('Saving message to history:', message);
    return of(undefined);
  }

  /**
   * Cria uma nova sessão de chat
   */
  createNewSession(dentistId: string): Observable<string> {
    console.log('Creating session for:', dentistId);
    return of('mock-session-id').pipe(delay(300));
  }

  /**
   * Retorna o histórico de mensagens para uma sessão
   */
  getSessionHistory(sessionId: string): Observable<Message[]> {
    return this.firestore.collection('chatSessions').doc(sessionId).get().pipe(
      map(doc => {
        if (doc.exists) {
          const data = doc.data() as ChatSession;
          return data.messages;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching chat history', error);
        return of([]);
      })
    );
  }

  /**
   * Gera uma resposta de fallback em caso de erro
   */
  private createFallbackResponse(): Observable<Message> {
    const randomResponse = this.fallbackResponses[
      Math.floor(Math.random() * this.fallbackResponses.length)
    ];
    
    const message: Message = {
      content: randomResponse,
      sender: 'bot',
      timestamp: new Date()
    };
    
    return of(message).pipe(delay(800)); // Pequeno delay para parecer mais natural
  }

  /**
   * Configuração personalizada do chatbot para um dentista específico
   */
  getDentistChatbotConfig(dentistId: string): Observable<any> {
    return this.firestore.collection('dentists').doc(dentistId).get().pipe(
      map(doc => {
        if (doc.exists) {
          const data = doc.data() as any;
          return data.chatbotConfig || {};
        }
        return {};
      }),
      catchError(error => {
        console.error('Error fetching chatbot config', error);
        return of({});
      })
    );
  }
}