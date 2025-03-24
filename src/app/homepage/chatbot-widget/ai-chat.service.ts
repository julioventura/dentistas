import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, delay, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../../../environments/environment';
import { UserService } from '../../shared/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SubcolecaoService } from '../../shared/subcolecao.service';

// Interface para Navegação
export interface NavigationContext {
  viewType?: string;
  collection?: string;
  id?: string;
  subcollection?: string;
  itemId?: string;
}

// Interface de Contexto
export interface ChatContext {
  currentView?: {
    type: string;
    id?: string;
    name?: string;
  };
  activeCollection?: string;
  activeSubcollections?: string[];
  currentRecord?: {
    id: string;
    data: any; // Dados completos do registro
  };
  pageData?: any; // Mantido por compatibilidade
}

// Interface para mensagem
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
  
  // BehaviorSubject para emitir atualizações de contexto
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
    private router: Router,
    private subcolecaoService: SubcolecaoService
  ) {
    // Monitorar o contexto de navegação do UserService
    this.userService.navigationContext$.subscribe(navContext => {
      this.updateContextFromNavigation(navContext);
      
      // Se o contexto tem um registro, atualizar explicitamente o currentRecord
      if (navContext.currentRecord) {
        this.currentContext.currentRecord = {
          id: navContext.currentRecord.id,
          data: navContext.currentRecord.data
        };
        
        // Se o contexto tem uma visualização mas não tem nome, tentar pegar do registro
        if (this.currentContext.currentView && !this.currentContext.currentView.name && navContext.currentRecord.data) {
          const recordData = navContext.currentRecord.data;
          
          // Tentar diferentes campos possíveis para o nome
          const possibleNameFields = ['nome', 'name', 'title', 'titulo', 'descricao'];
          for (const field of possibleNameFields) {
            if (recordData[field]) {
              this.currentContext.currentView.name = recordData[field];
              break;
            }
          }
        }
        
        // Emitir atualização após adicionar o registro
        this.contextSubject.next({...this.currentContext});
        
        console.log('Contexto atualizado com dados do registro:', this.currentContext);
      }
    });
    
    // Continuar monitorando eventos de navegação para casos especiais
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap((event: NavigationEnd) => {
        // Apenas para logging e casos especiais não capturados pelo UserService
        console.log('Navegação detectada pelo AiChatService:', event.url);
      })
    ).subscribe();
  }

  // Novo método para atualizar o contexto a partir do navegation context
  private updateContextFromNavigation(navContext: NavigationContext): void {
    // Reset de contexto
    this.currentContext = {};
    
    if (navContext.viewType) {
      this.currentContext.currentView = {
        type: navContext.viewType
      };
      
      // Adicionar collection como activeCollection
      if (navContext.collection) {
        this.currentContext.activeCollection = navContext.collection;
        
        // Se temos um ID, tentamos carregar os detalhes da entidade
        if (navContext.id) {
          this.currentContext.currentView.id = navContext.id;
          this.loadEntityDetails(navContext.collection, navContext.id);
        } else {
          // Se não temos ID, chamamos loadContextDataForView para pelo menos configurar informações básicas
          this.loadContextDataForView(navContext.collection, undefined);
        }
        
        // Se temos uma subcollection, adicionamos à lista de subcollections
        if (navContext.subcollection) {
          this.currentContext.activeSubcollections = [navContext.subcollection];
          
          // Se temos um item específico da subcollection
          if (navContext.itemId) {
            this.loadFichaDetails(
              navContext.collection, 
              navContext.id!, 
              navContext.subcollection, 
              navContext.itemId
            );
          }
        } else if (navContext.id) {
          // Se temos um ID mas não uma subcollection, verificamos subcoleções disponíveis
          this.checkAvailableSubcollections(navContext.collection, navContext.id);
        }
      }
    }
    
    // Log de contexto para debugging
    this.logContextUpdate();
    
    // Emitir a atualização do contexto para componentes inscritos
    this.contextSubject.next({...this.currentContext});
  }

  // Método melhorado para carregar dados específicos para o contexto
  private loadContextDataForView(viewType: string, id?: string): void {
    // Defina conjuntos conhecidos de coleções principais
    const knownCollections = ['pacientes', 'dentistas', 'fornecedores', 'produtos', 'agenda'];
    
    // Se o viewType corresponder a uma coleção conhecida, defina como activeCollection
    if (knownCollections.includes(viewType.toLowerCase())) {
      this.currentContext.activeCollection = viewType.toLowerCase();
      
      // Se temos um ID, carregamos os detalhes da entidade
      if (id) {
        this.loadEntityDetails(viewType, id);
      }
    } else {
      // Para outros casos, tentar inferir o que é esta rota
      switch(viewType.toLowerCase()) {
        case 'dashboard':
        case 'home':
          this.currentContext.currentView!.name = 'Dashboard';
          break;
          
        case 'config':
        case 'configuracoes':
          this.currentContext.currentView!.name = 'Configurações';
          break;
          
        case 'list':
          if (id) {
            this.currentContext.activeCollection = id;
            this.currentContext.currentView!.name = `Lista de ${id}`;
          }
          break;
          
        default:
          // Se não conseguirmos identificar, usar o próprio viewType
          if (!this.currentContext.activeCollection) {
            this.currentContext.activeCollection = viewType;
          }
      }
    }
  }
  
  // Método para carregar detalhes de uma entidade específica
  private loadEntityDetails(collectionType: string, id: string): void {
    const userId = this.userService.userProfile?.uid || this.userService.userEmail || 'default';
    const collectionPath = `users/${userId}/${collectionType}`;
    
    // Versão atualizada da API
    this.firestore.doc(`${collectionPath}/${id}`).get().subscribe({
      next: (doc) => {
        if (doc.exists) {
          const entityData = doc.data() as any;
          console.log('Dados carregados:', entityData);
          
          // Atualizar nome da entidade no contexto
          if (this.currentContext.currentView) {
            this.currentContext.currentView.name = entityData.nome || 
                                                  entityData.title || 
                                                  entityData.titulo || 
                                                  `${collectionType}: ${id}`;
            
            console.log('Nome atualizado para:', this.currentContext.currentView.name);
          }
          
          // Armazenar dados estruturados do registro atual
          this.currentContext.currentRecord = {
            id: id,
            data: entityData
          };
          
          // Manter pageData por compatibilidade
          this.currentContext.pageData = entityData;
          
          // Verificar subcoleções disponíveis para esta entidade
          this.checkAvailableSubcollections(collectionType, id);
          
          // Importante: emitir o contexto atualizado após todas as modificações
          this.contextSubject.next({...this.currentContext});
          
          console.log('Contexto atualizado após carregar dados:', this.currentContext);
        } else {
          console.log(`Documento não encontrado: ${collectionPath}/${id}`);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes:', error);
      }
    });
  }
  
  // Método para carregar detalhes de uma ficha específica
  private loadFichaDetails(collectionType: string, entityId: string, subcollection: string, fichaId: string): void {
    // Determinar o caminho correto da ficha
    const userId = this.userService.userProfile?.uid || this.userService.userEmail || 'default';
    const fichaPath = `users/${userId}/${collectionType}/${entityId}/fichas/${subcollection}/itens/${fichaId}`;
    
    console.log(`Carregando detalhes da ficha: ${fichaPath}`);
    
    // Carregar dados da ficha
    this.firestore.doc(fichaPath).get().subscribe({
      next: (doc) => {
        if (doc.exists) {
          const fichaData = doc.data() as any;
          console.log('Dados da ficha carregados:', fichaData);
          
          // Atualizar informações no contexto
          if (this.currentContext.currentView) {
            // Usar diferentes campos possíveis para o nome, com fallback
            this.currentContext.currentView.name = fichaData.nome || 
                                                  fichaData.title || 
                                                  fichaData.titulo || 
                                                  `${subcollection}: ${fichaId}`;
                                                  
            console.log('Nome da ficha definido como:', this.currentContext.currentView.name);
          }
          
          // Armazenar dados estruturados do registro de ficha atual
          this.currentContext.currentRecord = {
            id: fichaId,
            data: fichaData
          };
          
          // Manter pageData por compatibilidade
          this.currentContext.pageData = fichaData;
          
          // Emitir o contexto atualizado
          this.contextSubject.next({...this.currentContext});
          
          console.log('Contexto atualizado após carregar ficha:', this.currentContext);
        } else {
          console.log(`Ficha não encontrada: ${fichaPath}`);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes da ficha:', error);
      }
    });
  }
  
  // Método para verificar subcoleções disponíveis para uma entidade
  private checkAvailableSubcollections(collectionType: string, id: string): void {
    // Resetar subcoleções existentes
    this.currentContext.activeSubcollections = [];
    
    // Obter todas as subcoleções possíveis do SubcolecaoService
    const possibleSubcollections = this.subcolecaoService.getSubcolecoesDisponiveis().map(sc => sc.nome);
    
    // Obter userId do UserService
    const userId = this.userService.userProfile?.uid || this.userService.userEmail || 'default';
    
    // Contador para controlar quando todas as verificações foram concluídas
    let pendingChecks = possibleSubcollections.length;
    
    // Verificar cada subcoleção possível
    possibleSubcollections.forEach(subcollection => {
      // Caminho para verificar a subcoleção
      const subcollectionPath = `users/${userId}/${collectionType}/${id}/fichas/${subcollection}/itens`;
      
      this.firestore.collection(subcollectionPath).get().subscribe(snapshot => {
        if (!snapshot.empty) {
          // Se a subcoleção não estiver vazia, adicioná-la à lista
          if (!this.currentContext.activeSubcollections) {
            this.currentContext.activeSubcollections = [];
          }
          if (!this.currentContext.activeSubcollections.includes(subcollection)) {
            this.currentContext.activeSubcollections.push(subcollection);
          }
        }
        
        // Decrementar o contador de verificações pendentes
        pendingChecks--;
        
        // Se todas as verificações foram concluídas, emitir atualização
        if (pendingChecks === 0) {
          // Emitir a atualização do contexto
          this.contextSubject.next({...this.currentContext});
        }
      });
    });
  }

  // Log visual do contexto atual
  private logContextUpdate(): void {
    console.log('%c Contexto Atual do Chatbot ', 'background: #4b0082; color: white; padding: 2px;');
    console.log(`👤 Usuário: ${this.userService.userProfile?.name || this.userService.userEmail || 'Anônimo'}`);
    console.log(`📍 Visualizando: ${this.currentContext.currentView?.type || 'Home'}${this.currentContext.currentView?.name ? ` - ${this.currentContext.currentView.name}` : ''}`);
    console.log(`📋 Coleção: ${this.currentContext.activeCollection || 'N/A'}`);
    
    if (this.currentContext.activeSubcollections?.length) {
      console.log(`📂 Subcoleções: ${this.currentContext.activeSubcollections.join(', ')}`);
    }
    
    if (this.currentContext.pageData) {
      console.log('📄 Dados da página:', this.currentContext.pageData);
    }
  }

  // Método para enviar mensagem para a API
  sendMessage(message: string, sessionId: string, dentistId: string, context?: any): Observable<Message> {
    console.log('Enviando mensagem para OpenAI:', message);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.openaiApiKey}`
    });
    
    // Obter configuração do chatbot
    return this.getDentistChatbotConfig(dentistId).pipe(
      switchMap((config: any) => {
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
          temperature: 0.7,
          max_tokens: 1000
        };
        
        console.log('%c Payload para OpenAI: ', 'background: #4b0082; color: white; padding: 2px;');
        console.log(payload);
        
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
    prompt += `Forneça informações sobre Odontologia, de forma cordial e profissional.\n`;
    
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
    
    // Se estiver visualizando uma coleção específica
    if (context.collection) {
      prompt += `\nColeção atual: ${context.collection}\n`;
      
      // Se houver um registro específico
      if (context.currentRecord?.id) {
        prompt += `Registro ID: ${context.currentRecord.id}\n`;
        
        // Se houver dados do registro
        if (context.currentRecord.data) {
          const data = context.currentRecord.data;
          prompt += "Informações do registro atual:\n";
          
          // Mostrar os campos principais do registro
          Object.keys(data).forEach(key => {
            // Filtrar apenas campos simples (strings, números, datas)
            if (typeof data[key] !== 'object' && data[key] !== null) {
              prompt += `- ${key}: ${data[key]}\n`;
            }
          });
        }
      }
      
      // Se houver subcoleções disponíveis
      if (context.subcollections && context.subcollections.length > 0) {
        prompt += "\nFichas disponíveis:\n";
        context.subcollections.forEach((subcol: string) => {
          prompt += `- ${subcol}\n`;
        });
        prompt += "\nVocê pode fornecer sugestões ou análises baseadas nestas fichas.\n";
      }
    }
    
    // Instruções finais
    prompt += "\nResponda de forma concisa, profissional e útil. Evite respostas vagas. Forneça sugestões práticas quando apropriado.\n";
    
    return prompt;
  }

  // Método para obter configuração do chatbot para um dentista
  getDentistChatbotConfig(_dentistId: string): Observable<any> {
    // Aqui você pode buscar configurações personalizadas do chatbot para este dentista
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
      sender: 'bot' as 'bot', // Explicitly cast to the literal type 'bot'
      timestamp: new Date()
    }).pipe(delay(500));
  }

  // Método para criar nova sessão
  createNewSession(_dentistId: string): Observable<string> {
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    return of(sessionId);
  }

  // Método para salvar mensagem no histórico
  saveMessageToHistory(_sessionId: string, _dentistId: string, _message: Message): Observable<boolean> {
    return of(true); // Simplificado; implemente a lógica real de armazenamento
  }

  // Método para obter o contexto atual
  getCurrentContext(): ChatContext {
    return this.currentContext;
  }

  // Método para obter um campo específico do registro atual
  getRecordField(fieldName: string): any {
    if (!this.currentContext.currentRecord?.data) return null;
    return this.currentContext.currentRecord.data[fieldName];
  }

  // Método para verificar se um registro está carregado
  hasRecord(): boolean {
    return !!this.currentContext.currentRecord?.id;
  }

  // Método para obter o ID do registro atual
  getCurrentRecordId(): string | null {
    return this.currentContext.currentRecord?.id || null;
  }

  // Método para obter todos os dados do registro atual
  getCurrentRecordData(): any {
    return this.currentContext.currentRecord?.data || null;
  }
}