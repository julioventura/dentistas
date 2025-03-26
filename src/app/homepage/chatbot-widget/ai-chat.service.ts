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
  // Nova adição: histórico de navegação
  navigationHistory?: {
    lastCollection?: string;
    lastId?: string;
    lastSubcollection?: string;
    lastItemId?: string;
  };
  // Nova adição: estrutura hierárquica de dados
  hierarchy?: {
    [collection: string]: {
      [id: string]: {
        data?: any;  // Dados do registro principal
        subcollections?: {
          [subcollection: string]: {
            [itemId: string]: any;  // Dados do registro da subcollection
          }
        }
      }
    }
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
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   tap((event: NavigationEnd) => {
    //     // Apenas para logging e casos especiais não capturados pelo UserService
    //     console.log('Navegação detectada pelo AiChatService:', event.url);
    //   })
    // ).subscribe();

    // Use the updateContextFromUrl method with router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap((event: NavigationEnd) => {
        console.log('Navegação detectada pelo AiChatService:', event.url);
        // Call updateContextFromUrl when navigation happens
        this.updateContextFromUrl(event.url);
      })
    ).subscribe();
  }

  // Novo método para atualizar o contexto a partir do navegation context
  private updateContextFromNavigation(navContext: NavigationContext): void {
    // Não resetar completamente o contexto, apenas atualizá-lo
    // this.currentContext = {}; <- Remover este reset

    if (!this.currentContext) {
      this.currentContext = {};
    }

    if (navContext.viewType) {
      // Preservar collection e registro quando acessa list-fichas
      const isListFichas = navContext.viewType.toLowerCase() === 'list-fichas';
      
      // Atualizar tipo de visualização sempre
      this.currentContext.currentView = {
        ...this.currentContext.currentView,
        type: navContext.viewType
      };
      
      // Adicionar collection como activeCollection (se não for list-fichas ou não tivermos uma collection)
      if (navContext.collection && (!isListFichas || !this.currentContext.activeCollection)) {
        this.currentContext.activeCollection = navContext.collection;
        
        // Se temos um ID e não estamos em list-fichas ou não temos dados do registro
        if (navContext.id && (!isListFichas || !this.mainRecordData)) {
          this.currentContext.currentView.id = navContext.id;
          
          // Carregar detalhes apenas se ainda não tivermos
          if (!this.mainRecordData || this.mainRecordData._id !== navContext.id) {
            this.loadEntityDetails(navContext.collection, navContext.id);
          }
        } else {
          // Se não temos ID, chamamos loadContextDataForView para pelo menos configurar informações básicas
          this.loadContextDataForView(navContext.collection, undefined);
        }
        
        // Se temos uma subcollection, adicionamos à lista de subcollections
        if (navContext.subcollection) {
          this.currentContext.activeSubcollections = [navContext.subcollection];
          
          // Se estamos em list-fichas, mantemos os dados do registro principal
          if (isListFichas && this.mainRecordData) {
            console.log('Mantendo dados do registro principal em list-fichas', this.mainRecordData);
            
            // Garantir que o registro principal está no contexto atual
            if (!this.currentContext.currentRecord || this.currentContext.currentRecord.id !== navContext.id) {
              this.currentContext.currentRecord = {
                id: navContext.id!,
                data: this.mainRecordData
              };
            }
          }
          
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
  
  /**
   * Armazena o registro principal para exibição mesmo durante visualização de subcollection
   */
  private mainRecordData: any = null;
  
  // Método para carregar detalhes de uma entidade específica
  private loadEntityDetails(collectionType: string, id: string): void {
    const userId = this.userService.userProfile?.uid || this.userService.userEmail || 'default';
    const collectionPath = `users/${userId}/${collectionType}`;
    
    this.firestore.doc(`${collectionPath}/${id}`).get().subscribe({
      next: (doc) => {
        if (doc.exists) {
          const entityData = doc.data() as any;
          console.log('Dados carregados:', entityData);
          
          // Armazenar dados do registro principal para uso posterior
          this.mainRecordData = entityData;
          
          // Atualizar nome da entidade no contexto
          if (this.currentContext.currentView) {
            this.currentContext.currentView.name = entityData.nome || 
                                                 `${collectionType}: ${id}`;
          }
          
          // Armazenar dados estruturados do registro atual
          this.currentContext.currentRecord = {
            id: id,
            data: entityData
          };
          
          // Adicionar à hierarquia
          this.updateHierarchyMainRecord(collectionType, id, entityData);
          
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
  
  /**
   * Método público para acessar dados do registro principal
   */
  getMainRecordData(): any {
    return this.mainRecordData;
  }
  
  // Método para carregar detalhes de uma ficha específica
  private loadFichaDetails(collectionType: string, entityId: string, subcollection: string, fichaId: string): void {
    const userId = this.userService.userProfile?.uid || this.userService.userEmail || 'default';
    const fichaPath = `users/${userId}/${collectionType}/${entityId}/fichas/${subcollection}/itens/${fichaId}`;
    
    this.firestore.doc(fichaPath).get().subscribe({
      next: (doc) => {
        if (doc.exists) {
          const fichaData = doc.data() as any;
          console.log('Dados da ficha carregados:', fichaData);
          
          // Atualizar informações no contexto
          if (this.currentContext.currentView) {
            this.currentContext.currentView.name = fichaData.nome || 
                                                 fichaData.title || 
                                                 fichaData.titulo || 
                                                 `${subcollection}: ${fichaId}`;
          }
          
          // Armazenar dados estruturados do registro de ficha atual
          this.currentContext.currentRecord = {
            id: fichaId,
            data: fichaData
          };
          
          // Adicionar à hierarquia
          this.updateHierarchySubcollectionRecord(
            collectionType, 
            entityId, 
            subcollection, 
            fichaId, 
            fichaData
          );
          
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

  // Método para atualizar registro principal na hierarquia
  private updateHierarchyMainRecord(collection: string, id: string, data: any): void {
    if (!this.currentContext.hierarchy) {
      this.currentContext.hierarchy = {};
    }
    
    if (!this.currentContext.hierarchy[collection]) {
      this.currentContext.hierarchy[collection] = {};
    }
    
    if (!this.currentContext.hierarchy[collection][id]) {
      this.currentContext.hierarchy[collection][id] = {};
    }
    
    this.currentContext.hierarchy[collection][id].data = data;
    
    // Atualizar o histórico de navegação
    if (!this.currentContext.navigationHistory) {
      this.currentContext.navigationHistory = {};
    }
    
    this.currentContext.navigationHistory.lastCollection = collection;
    this.currentContext.navigationHistory.lastId = id;
    
    console.log('Hierarquia atualizada com registro principal:', collection, id);
  }

  // Método para atualizar registro de subcollection na hierarquia
  private updateHierarchySubcollectionRecord(
    collection: string, 
    id: string, 
    subcollection: string, 
    itemId: string, 
    data: any
  ): void {
    // Garantir que a estrutura existe
    if (!this.currentContext.hierarchy) {
      this.currentContext.hierarchy = {};
    }
    
    if (!this.currentContext.hierarchy[collection]) {
      this.currentContext.hierarchy[collection] = {};
    }
    
    if (!this.currentContext.hierarchy[collection][id]) {
      this.currentContext.hierarchy[collection][id] = {};
    }
    
    if (!this.currentContext.hierarchy[collection][id].subcollections) {
      this.currentContext.hierarchy[collection][id].subcollections = {};
    }
    
    if (!this.currentContext.hierarchy[collection][id].subcollections![subcollection]) {
      this.currentContext.hierarchy[collection][id].subcollections![subcollection] = {};
    }
    
    // Atualizar os dados
    this.currentContext.hierarchy[collection][id].subcollections![subcollection][itemId] = data;
    
    // Atualizar o histórico de navegação
    if (!this.currentContext.navigationHistory) {
      this.currentContext.navigationHistory = {};
    }
    
    this.currentContext.navigationHistory.lastCollection = collection;
    this.currentContext.navigationHistory.lastId = id;
    this.currentContext.navigationHistory.lastSubcollection = subcollection;
    this.currentContext.navigationHistory.lastItemId = itemId;
    
    console.log('Hierarquia atualizada com registro de subcollection:', collection, id, subcollection, itemId);
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

  // Add comment to explain why sessionId is returned but not used directly
  // Adicione um comentário explicando o uso da variável sessionId
  createNewSession(dentistId: string): Observable<string> {
    // sessionId é retornado para ser usado pelo componente chamador
    const sessionId = 'session_' + dentistId + '_' + Math.random().toString(36).substring(2, 15);
    console.log(`Criando nova sessão para dentista: ${dentistId} com ID: ${sessionId}`);
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

  // Métodos públicos para acessar dados da hierarquia
  getCollectionRecord(collection: string, id: string): any {
    try {
      return this.currentContext.hierarchy?.[collection]?.[id]?.data || null;
    } catch (error) {
      console.error('Erro ao acessar registro da collection:', error);
      return null;
    }
  }

  getSubcollectionRecord(collection: string, id: string, subcollection: string, itemId: string): any {
    try {
      return this.currentContext.hierarchy?.[collection]?.[id]?.subcollections?.[subcollection]?.[itemId] || null;
    } catch (error) {
      console.error('Erro ao acessar registro de subcollection:', error);
      return null;
    }
  }

  getLastCollectionRecord(): any {
    const nav = this.currentContext.navigationHistory;
    if (!nav || !nav.lastCollection || !nav.lastId) return null;
    
    return this.getCollectionRecord(nav.lastCollection, nav.lastId);
  }

  getLastSubcollectionRecord(): any {
    const nav = this.currentContext.navigationHistory;
    if (!nav || !nav.lastCollection || !nav.lastId || !nav.lastSubcollection || !nav.lastItemId) return null;
    
    return this.getSubcollectionRecord(
      nav.lastCollection,
      nav.lastId,
      nav.lastSubcollection,
      nav.lastItemId
    );
  }

  /**
   * Detecta navegação para Home e limpa o contexto
   */
  private updateContextFromUrl(url: string): void {
    // Verifica se estamos na Home (página raiz ou rota específica da home)
    if (url === '/' || url === '/home' || url.startsWith('/?') || url.startsWith('/home?')) {
      console.log('Navegação para Home detectada. Limpando contexto do chatbot.');
      this.resetContext();
      return;
    }

    // Continuar com a lógica existente para outras rotas
    const urlPattern = /\/([^\/]+)\/([^\/]+)(?:\/fichas\/([^\/]+)\/itens\/([^\/]+))?/;
    // Usar a variável matches ou comentar a linha se não for usada
    // const matches = url.match(urlPattern);
    
    // Ou usar o resultado imediatamente:
    if (url.match(urlPattern)) {
      // Processar a URL que não seja da página inicial
      console.log('URL corresponde ao padrão de navegação específica');
    }
    
    // Resto do seu código para outras rotas...
  }

  /**
   * Limpa completamente o contexto do chatbot
   */
  public resetContext(): void {
    this.currentContext = {
      currentView: {
        type: 'Home'
      }
    };
    
    // Limpar dados do registro principal
    this.mainRecordData = null;
    
    // Emitir o contexto limpo
    this.contextSubject.next({...this.currentContext});
    console.log('Contexto do chatbot resetado.', this.currentContext);
  }

  /**
   * Método público para limpar o contexto a partir de outros componentes
   */
  public clearContext(): void {
    this.resetContext();
  }

  /**
   * Limpa completamente a hierarquia de registros no contexto
   * Mantem apenas informações básicas de navegação
   */
  public resetHierarchyData(): void {
    // Armazena temporariamente informações básicas que queremos preservar
    const currentView = this.currentContext.currentView;
    const activeCollection = this.currentContext.activeCollection;
    
    // Limpa estrutura de hierarquia e registros
    this.currentContext.hierarchy = {};
    this.currentContext.currentRecord = undefined; // Changed from null to undefined to match type
    this.currentContext.navigationHistory = {};
    this.currentContext.pageData = null;
    this.mainRecordData = null;
    
    // Restaura informações básicas
    this.currentContext.currentView = currentView;
    this.currentContext.activeCollection = activeCollection;
    
    // Emite o contexto limpo
    this.contextSubject.next({...this.currentContext});
    console.log('Hierarquia de dados do contexto resetada.');
  }
}