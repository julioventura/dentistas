import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, delay, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../../../environments/environment';
import { UserService } from '../../shared/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Interface de Contexto
export interface ChatContext {
  currentView?: {
    type: string;
    id?: string;
    name?: string;
  };
  activeCollection?: string;
  activeSubcollections?: string[];
  pageData?: any;
}

// Interface para mensagem (já deve existir, mantendo para referência)
export interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Interface para resposta da OpenAI
interface OpenAIResponse {
  choices: [{
    message: {
      content: string;
    }
  }];
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private openaiApiUrl = environment.openaiApiUrl;
  private openaiModel = environment.openaiModel;
  private currentContext: ChatContext = {};
  
  // Adicionar BehaviorSubject para emitir atualizações de contexto
  private contextSubject = new BehaviorSubject<ChatContext>({});
  public context$ = this.contextSubject.asObservable();
  
  // Fallback responses para quando a API falha
  private fallbackResponses = [
    "Desculpe, estou tendo dificuldades para processar sua solicitação no momento.",
    "Parece que estou com problemas de conexão. Pode tentar novamente?",
    "Ops! Algo deu errado. Poderia reformular sua pergunta?",
    "Não consegui processar isso agora. Tente novamente em alguns instantes.",
    "Estou com dificuldades técnicas. Seria possível tentar novamente?"
  ];
  
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private userService: UserService,
    private router: Router
  ) {
    // Monitora navegação para atualizar contexto
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap((event: NavigationEnd) => {
        this.updateContextFromRoute(event.url);
      })
    ).subscribe();
  }

  // Método para atualizar contexto baseado na rota
  private updateContextFromRoute(route: string): void {
    // Reset de contexto
    this.currentContext = {};
    
    const segments = route.split('/').filter(Boolean);
    
    if (segments.length > 0) {
      // Primeiro segmento é o tipo de visualização
      const viewType = segments[0];
      this.currentContext.currentView = { type: viewType };
      
      // Se há um segundo segmento, é um ID
      if (segments.length > 1) {
        this.currentContext.currentView.id = segments[1];
        
        // Carrega dados específicos baseados no tipo de visualização
        this.loadContextDataForView(viewType, segments[1]);
      }
    }
    
    // Log de contexto para debugging
    this.logContextUpdate();
    
    // Emitir a atualização do contexto para componentes inscritos
    this.contextSubject.next({...this.currentContext});
  }
  
  // Carrega dados específicos para o contexto baseado no tipo de visualização
  private loadContextDataForView(viewType: string, id?: string): void {
    switch(viewType.toLowerCase()) {
      case 'pacientes':
        this.currentContext.activeCollection = 'pacientes';
        if (id) {
          // Carregar informações do paciente se ID fornecido
          this.firestore.collection('pacientes').doc(id).get().subscribe(doc => {
            if (doc.exists) {
              const patientData = doc.data() as any;
              if (this.currentContext.currentView) {
                this.currentContext.currentView.name = patientData.nome;
              }
              this.currentContext.pageData = patientData;
              
              // Verifica quais subcoleções existem para este paciente
              this.checkSubcollections(id);
              
              // Notificar inscritos sobre a mudança
              this.contextSubject.next({...this.currentContext});
            }
          });
        }
        break;
        
      case 'agenda':
        this.currentContext.activeCollection = 'agenda';
        if (id) {
          // Se for uma data específica
          this.firestore.collection('agenda').doc(id).get().subscribe(doc => {
            if (doc.exists) {
              this.currentContext.pageData = doc.data();
              if (this.currentContext.currentView) {
                this.currentContext.currentView.name = `Agenda: ${id}`;
              }
              
              // Notificar inscritos sobre a mudança
              this.contextSubject.next({...this.currentContext});
            }
          });
        } else {
          // Agenda do dia atual
          const today = new Date().toISOString().split('T')[0];
          if (this.currentContext.currentView) {
            this.currentContext.currentView.name = `Agenda: ${today}`;
          }
          
          // Notificar inscritos sobre a mudança
          this.contextSubject.next({...this.currentContext});
        }
        break;
      
      default:
        this.currentContext.activeCollection = viewType.toLowerCase();
        
        // Notificar inscritos sobre a mudança
        this.contextSubject.next({...this.currentContext});
    }
  }
  
  // Verifica subcoleções existentes para um paciente
  private checkSubcollections(patientId: string): void {
    // Reset subcoleções ao checar novamente
    this.currentContext.activeSubcollections = [];
    
    // Lista de subcoleções comuns para verificar
    const subcollections = ['fichas', 'tratamentos', 'pagamentos', 'exames'];
    
    let pendingChecks = subcollections.length;
    
    subcollections.forEach(subcollection => {
      this.firestore.collection(`pacientes/${patientId}/${subcollection}`).get().subscribe(snapshot => {
        if (!snapshot.empty) {
          if (!this.currentContext.activeSubcollections) {
            this.currentContext.activeSubcollections = [];
          }
          if (!this.currentContext.activeSubcollections.includes(subcollection)) {
            this.currentContext.activeSubcollections.push(subcollection);
          }
        }
        
        // Decrementar pendingChecks
        pendingChecks--;
        
        // Se todas as verificações foram concluídas, emitir atualização
        if (pendingChecks === 0) {
          this.contextSubject.next({...this.currentContext});
        }
      });
    });
  }

  // Log visual do contexto atual
  private logContextUpdate(): void {
    console.log('%c Contexto Atual do Chatbot ', 'background: #4b0082; color: white; padding: 2px;');
    console.log(`%c👤 Usuário: ${this.userService.userProfile?.name || this.userService.userEmail || 'Anônimo'}`,'background: #4b0082; color: white; padding: 2px;');
    console.log(`%c📍 Visualizando: ${this.currentContext.currentView?.type || 'Home'}${this.currentContext.currentView?.name ? ` - ${this.currentContext.currentView.name}` : ''}`, 'background: #4b0082; color: white; padding: 2px;');
    console.log(`%c📋 Coleção: ${this.currentContext.activeCollection || 'N/A'}`, 'background: #4b0082; color: white; padding: 2px;');
    
    if (this.currentContext.activeSubcollections?.length) {
      console.log(`%c📂 Subcoleções: ${this.currentContext.activeSubcollections.join(', ')}`, 'background: #4b0082; color: white; padding: 2px;');
    }
  }

  // Método para enviar mensagem para a API
  sendMessage(message: string, sessionId: string, dentistId: string, context?: any): Observable<Message> {
    console.log('%c Enviando mensagem para OpenAI:', message, 'background:rgb(65, 174, 127); color: white; padding: 2px;');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.openaiApiKey}`
    });
    
    // Obter configuração do chatbot
    return this.getDentistChatbotConfig(dentistId).pipe(
      switchMap((config: any) => { // Tipado explicitamente como any
        // Mesclando contexto existente com novo contexto da página atual
        const enhancedContext = {
          ...context,
          dentistName: this.userService.context?.dentistName,
          location: this.userService.context?.location,
          patientName: this.userService.context?.patientName,
          userRole: this.userService.userProfile?.role || 'dentista',
          currentView: this.currentContext.currentView?.type,
          viewName: this.currentContext.currentView?.name,
          collection: this.currentContext.activeCollection,
          subcollections: this.currentContext.activeSubcollections,
          pageData: this.currentContext.pageData
        };
        
        // Constrói um prompt de sistema contextualizado
        const systemPrompt = config.systemPrompt || this.buildContextualSystemPrompt(enhancedContext);
        
        const payload = {
          model: this.openaiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.3,
          max_tokens: 1000
        };
        
        console.log('%c Payload para OpenAI: ', 'background: #4b0082; color: white; padding: 2px;', payload);

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
            console.error('Erro ao chamar API:', error);
            return this.createFallbackResponse();
          })
        );
      }),
      catchError(error => {
        console.error('Erro ao preparar requisição OpenAI:', error);
        return this.createFallbackResponse();
      })
    );
  }

  // Método para construir um prompt de sistema contextualizado
  private buildContextualSystemPrompt(context: any): string {
    let prompt = `Você é um assistente virtual odontológico para o consultório do Dr(a). ${context.dentistName || 'Fulano'}.\n`;
    prompt += `Forneça informações sobre Odontologia, de forma profissional.\n`;
    prompt += `Dispense a frase final usual de oferecer atenção adicional como em 'Se precisar de mais informações, estou à disposição!'\n`; 
    
    // Adiciona informações profissionais do dentista
    if (context.dentistSpecialty) {
      prompt += `O dentista é especializado em ${context.dentistSpecialty}.\n`;
    }
    
    // Informações sobre a localização
    if (context.location) {
      prompt += `O consultório está localizado em ${context.location}.\n`;
    }
    
    // Adiciona o contexto da página atual
    if (context.currentView) {
      prompt += `\nCONTEXTO ATUAL: O usuário está na seção "${context.currentView}"`;
      
      if (context.viewName) {
        prompt += ` visualizando "${context.viewName}".\n`;
      } else {
        prompt += ".\n";
      }
    }
    
    // Se estiver vendo um paciente específico
    if (context.currentView === 'pacientes' && context.patientName) {
      prompt += `\nPaciente: ${context.patientName}\n`;
      
      // Se houver dados do paciente na página
      if (context.pageData) {
        const data = context.pageData;
        prompt += "Informações disponíveis sobre o paciente:\n";
        
        if (data.idade) prompt += `- Idade: ${data.idade} anos\n`;
        if (data.telefone) prompt += `- Telefone: ${data.telefone}\n`;
        if (data.email) prompt += `- Email: ${data.email}\n`;
        if (data.ultimaConsulta) prompt += `- Última consulta: ${data.ultimaConsulta}\n`;
      }
      
      // Se houver subcoleções disponíveis
      if (context.subcollections && context.subcollections.length > 0) {
        prompt += "\nRegistros disponíveis para este paciente:\n";
        context.subcollections.forEach((subcol: string) => {
          prompt += `- ${subcol}\n`; // Corrigido: fechamento incorreto da string
        });
        prompt += "\nVocê pode fornecer sugestões ou análises baseadas nestes registros.\n";
      }
    }
    
    // Instruções finais
    prompt += "\nResponda de forma concisa, profissional e útil. Evite respostas vagas.\n";
    
    // Garantir que sempre retorne a string
    return prompt; 
  }

  // Método para obter configuração do chatbot para um dentista
  getDentistChatbotConfig(dentistId: string): Observable<any> {
    console.log(`Carregando configuração do chatbot para dentista ${dentistId}`);
    // Aqui você pode buscar configurações personalizadas do chatbot para este dentista
    // Por enquanto, retorna configuração padrão
    return of({
      systemPrompt: '',  // Se vazio, usará o prompt contextual padrão
      temperature: 0.7,
      maxTokens: 1000
    });
  }

  // Método para criar resposta de fallback
  createFallbackResponse(): Observable<Message> {
    const randomIndex = Math.floor(Math.random() * this.fallbackResponses.length);
    return of({
      content: this.fallbackResponses[randomIndex],
      sender: 'bot' as 'bot',
      timestamp: new Date()
    }).pipe(delay(500));
  }

  // Método para criar nova sessão
  createNewSession(dentistId: string): Observable<string> {
    console.log(`Criando nova sessão para dentista ${dentistId}`);
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    return of(sessionId);
  }

  // Método para salvar mensagem no histórico
  saveMessageToHistory(sessionId: string, dentistId: string, message: Message): Observable<boolean> {
    console.log(`Salvando mensagem para sessão ${sessionId}`);
    // Aqui implementaria a lógica para salvar a mensagem
    // Por enquanto, apenas simula sucesso
    return of(true);
  }

  // Método para obter o contexto atual
  getCurrentContext(): ChatContext {
    return {...this.currentContext};
  }
}