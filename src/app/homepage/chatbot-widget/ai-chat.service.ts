import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, delay, switchMap } from 'rxjs/operators';
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

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private openaiApiUrl = environment.openaiApiUrl;
  private openaiApiKey = environment.openaiApiKey;
  private openaiModel = environment.openaiModel;
  
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
   * Envia uma mensagem para a API da OpenAI e retorna a resposta
   */
  sendMessage(message: string, sessionId: string, dentistId: string, context?: any): Observable<Message> {
    console.log('Sending message to OpenAI:', message, 'for session:', sessionId);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.openaiApiKey}`
    });
    
    // Obtém configuração do chatbot para este dentista
    return this.getDentistChatbotConfig(dentistId).pipe(
      switchMap(config => { // Aqui trocamos map por switchMap para achatamento correto das Observables
        // Define o sistema de prompt base com informações do dentista
        const systemPrompt = config.systemPrompt || 
          `Você é um assistente virtual odontológico para o consultório do Dr(a). ${context?.dentistName || 'Doutor'}. 
          Forneça informações sobre procedimentos odontológicos, higiene bucal e agende consultas de forma cordial e profissional.
          Limite suas respostas a conhecimentos odontológicos e ajuda ao paciente.`;
          
        const payload = {
          model: this.openaiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000
        };
        
        return this.http.post<OpenAIResponse>(this.openaiApiUrl, payload, { headers }).pipe(
          map(response => {
            const botMessage: Message = {
              content: response.choices[0].message.content.trim(),
              sender: 'bot',
              timestamp: new Date()
            };
            return botMessage;
          }),
          catchError(error => {
            console.error('Error calling OpenAI API:', error);
            return this.createFallbackResponse();
          })
        );
      }),
      catchError(error => {
        console.error('Error preparing OpenAI request:', error);
        return this.createFallbackResponse();
      })
    );
  }

  /**
   * Salva a mensagem no histórico do Firestore
   */
  saveMessageToHistory(sessionId: string, dentistId: string, message: Message): Observable<void> {
    return new Observable<void>(observer => {
      this.firestore.collection('chatSessions').doc(sessionId).update({
        messages: firebase.firestore.FieldValue.arrayUnion(message),
        lastMessageAt: new Date()
      })
        .then(() => {
          console.log('Message saved to history');
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.error('Error saving message to history:', error);
          observer.error(error);
          // Completar mesmo com erro para não interromper a conversa
          observer.complete();
        });
    });
  }

  /**
   * Cria uma nova sessão de chat
   */
  createNewSession(dentistId: string): Observable<string> {
    const sessionId = this.firestore.createId();
    const session: ChatSession = {
      id: sessionId,
      userId: 'anonymous', // Pode ser atualizado depois com autenticação
      dentistId: dentistId,
      messages: [],
      startedAt: new Date(),
      lastMessageAt: new Date()
    };
    
    return new Observable<string>(observer => {
      this.firestore.collection('chatSessions').doc(sessionId).set(session)
        .then(() => {
          console.log('Chat session created with ID:', sessionId);
          observer.next(sessionId);
          observer.complete();
        })
        .catch(error => {
          console.error('Error creating chat session:', error);
          observer.error(error);
          // Caso haja erro, vamos retornar um ID temporário para não bloquear a conversa
          observer.next('temp-' + Math.random().toString(36).substring(2, 9));
          observer.complete();
        });
    });
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