import { Injectable, Injector, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreService } from '../shared/firestore.service'; // Serviço para manipular o Firestore
import firebase from 'firebase/compat/app'; // Importa firebase para usar firebase.User
import { Observable, of, from, BehaviorSubject, firstValueFrom } from 'rxjs'; // Adicionar firstValueFrom aqui
import { map, catchError, switchMap, tap, filter } from 'rxjs/operators'; // Remover firstValueFrom daqui
import { Router, NavigationEnd } from '@angular/router';

import { AiChatService } from '../homepage/chatbot-widget/ai-chat.service';

// Interface para o contexto de navegação
export interface NavigationContext {
  collection?: string;
  id?: string;
  subcollection?: string;
  itemId?: string;
  viewType?: string; // list, view, edit, etc.
  currentRecord?: {   // Adicionado para armazenar dados do registro atual
    id: string;
    data: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Estado público para fácil acesso dos componentes
  userEmail: string | null = null;
  
  // Variável privada para o perfil do usuário
  private _userProfile: any = null;
  
  // User data property
  user: any = null;
  
  // Observable para permitir componentes reagirem a mudanças (opcional)
  private userProfileSubject = new BehaviorSubject<any>(null);
  public userProfile$ = this.userProfileSubject.asObservable();
  
  // Dados do chatbot (você pode setar esses valores conforme seu fluxo)
  // Contexto do chatbot para armazenar dados dinâmicos
  public context: any = {
    dentistId: 'Ludovico',
    dentistName: 'Clínica Dente Feliz',
    location: 'Rua Amapá, 55 - Moema - São Paulo, SP',
    patientName: 'João Silva'
  };
 
  // Status do chatbot: true = expandido, false = minimizado
  private _chatbotExpanded = new BehaviorSubject<boolean>(false);
  chatbotExpanded$ = this._chatbotExpanded.asObservable();

  // Adicionar o contexto de navegação
  private navigationContextSubject = new BehaviorSubject<NavigationContext>({});
  public navigationContext$ = this.navigationContextSubject.asObservable();

  // Corrigir o construtor com injeção adequada
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService<any>,
    private router: Router,
    private injector: Injector  // Remover @Inject, não é necessário para Injector no construtor
  ) {
    console.log('UserService initialized');
    // Carregar dados do usuário autenticado no inicialização do serviço
    this.afAuth.authState.pipe(
      tap(user => {
        if (user?.email) {
          this.userEmail = user.email;
          console.log('UserService: User authenticated:', this.userEmail);
        }
      })
    ).subscribe();

    // Monitorar mudanças de rota para atualizar o contexto
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateContextFromUrl(event.url);
    });
  }

  // Getter para userProfile - acesso direto simplificado
  get userProfile(): any {
    return this._userProfile;
  }

  // Setter para userProfile - centraliza a atualização
  setUserProfile(profile: any): void {
    console.log('UserService: Setting userProfile', profile);
    this._userProfile = profile;
    this.userProfileSubject.next(profile);
    
    // Opcional: armazenar em localStorage para persistência entre refreshes
    if (profile) {
      localStorage.setItem('userProfileCache', JSON.stringify(profile));
    }
  }

  // Método para recuperar perfil do usuário pelo username
  loadUserProfileByUsername(username: string): Observable<any> {
    console.log('UserService: Loading profile for username:', username);
    return this.firestoreService.getRegistroByUsername('usuarios/dentistascombr/users', username)
      .pipe(
        tap(userProfiles => {
          if (userProfiles && userProfiles.length > 0) {
            this.setUserProfile(userProfiles[0]);
            console.log('UserService: Profile loaded successfully');
          } else {
            console.log('UserService: No profile found for username:', username);
          }
        }),
        catchError(error => {
          console.error('UserService: Error loading profile:', error);
          return of(null);
        })
      );
  }

  // Método para atualizar o perfil do usuário
  updateUserProfile(userEmail: string, profileData: any): Promise<void> {
    console.log('UserService: Updating profile for:', userEmail);
    
    if (!userEmail) {
      console.error('UserService: Email not provided for profile update');
      return Promise.reject('Email do usuário não fornecido');
    }
    
    // Atualizar o userProfile local ao mesmo tempo que salva no Firestore
    this.setUserProfile(profileData);
    
    return this.firestore.collection('usuarios')
      .doc('dentistascombr')
      .collection('users')
      .doc(userEmail)
      .update(profileData)
      .then(() => {
        console.log('UserService: Profile updated successfully');
      })
      .catch(error => {
        console.error('UserService: Error updating profile:', error);
        throw error;
      });
  }

  // Método para limpar os dados do usuário no logout
  clearUserData(): void {
    this._userProfile = null;
    this.userEmail = null;
    this.userProfileSubject.next(null);
    localStorage.removeItem('userProfileCache');
    console.log('UserService: User data cleared');
  }

  // Método para pegar os dados do usuário autenticado
  getUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  // Carregar dados do usuário autenticado
  loadUserData() {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        this.user = parsedData;
        console.log('User data loaded from localStorage:', this.user);
        return parsedData;
      }
      return {}; // Return empty object if no data found
    } catch (error) {
      console.error('Error loading user data:', error);
      return {}; // Return empty object on error
    }
  }

  // Add method to get user profile data asynchronously
  getUserProfileData(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(authUser => {
        if (authUser && authUser.email) {
          this.userEmail = authUser.email;
          return this.firestoreService.getRegistroById('usuarios/dentistascombr/users', this.userEmail).pipe(
            tap(profileData => {
              if (profileData) {
                this.setUserProfile(profileData);
              }
            })
          );
        }
        return of(null);
      }),
      catchError(error => {
        console.error('Error getting user profile data:', error);
        return of(null);
      })
    );
  }

  // Método para criar um documento de usuário na coleção 'usuarios/dentistascombr'
  createUserInFirestore(user: firebase.User, name?: string, username?: string): void {
    // Usa o email do usuário como chave do documento
    const userEmail = user.email;
    if (!userEmail) {
      console.error('O usuário não possui um email válido.');
      return;
    }

    // Referência ao documento do usuário usando o email como ID
    const userRef = this.firestore.collection('usuarios').doc('dentistascombr').collection('users').doc(userEmail);

    userRef.get().subscribe((doc) => {
      if (!doc.exists) {
        userRef.set({
          uid: user.uid,
          email: user.email,
          nome: name || '',               // Adicionar nome
          username: username || '',       // Adicionar apelido
          provider: user.providerData[0]?.providerId || 'emailAndPassword',
          createdAt: new Date(),
        }).then(() => {
          console.log('Usuário criado na coleção usuarios/dentistascombr com email como chave.');
        }).catch((error) => {
          console.error('Erro ao criar o usuário na coleção usuarios/dentistascombr:', error);
        });
      } else {
        console.log('Usuário já existe na coleção usuarios/dentistascombr');
        // Se o usuário existir, mas queremos atualizar nome e username
        if (name || username) {
          const updateData: any = {};
          if (name) updateData.nome = name;
          if (username) updateData.username = username;
          
          userRef.update(updateData).then(() => {
            console.log('Nome e username atualizados para o usuário existente');
          }).catch(error => {
            console.error('Erro ao atualizar nome e username:', error);
          });
        }
      }
    });
  }

  // Método para chamar após o login bem-sucedido
  loginSuccess(user: firebase.User, name?: string, username?: string) {
    this.createUserInFirestore(user, name, username); // Passa os parâmetros adicionais
  }

  // NOVO MÉTODO: Validação de username
  isValidUsername(username: string | null): Observable<boolean> {
    if (!username) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    // Verifica no Firestore se o username existe
    return this.firestore.collection('usuarios')
      .doc('dentistascombr')
      .collection('users', ref => ref.where('username', '==', username))
      .get()
      .pipe(
        map(snapshot => {
          // Verifica se o snapshot tem documentos, ou seja, se o username existe
          return !snapshot.empty;
        })
      );
  }
  
  // NOVO MÉTODO: Salvar username se estiver disponível
  saveUsernameIfAvailable(userId: string, username: string): Observable<boolean> {
    return this.isValidUsername(username).pipe(
      map(exists => !exists), // Inverte o resultado: true se não existir (disponível)
      switchMap(isAvailable => {
        if (isAvailable) {
          // Username disponível, salvar no perfil do usuário
          return from(this.firestore.collection('usuarios')
            .doc('dentistascombr')
            .collection('users')
            .doc(userId)
            .update({ username: username })
            .then(() => true)
            .catch(err => {
              console.error("Erro ao salvar username:", err);
              return false;
            })
          );
        } else {
          // Username já existe
          return of(false);
        }
      })
    );
  }

  // Método para atualizar o contexto com base na URL
  private updateContextFromUrl(url: string): void {
    // Extrair os segmentos da URL
    const segments = url.split('/').filter(Boolean);
    const context: NavigationContext = {};
    
    // Se estamos navegando para uma nova URL que indica criação de novo registro
    if (segments.length > 0 && segments[0] === 'new') {
      console.log('Criando novo registro - limpando o contexto anterior');
      // Limpar o contexto atual, mantendo apenas o tipo de coleção
      if (segments.length > 1) {
        context.collection = segments[1];
      }
      context.viewType = 'new';
      
      // Limpar registro atual
      context.currentRecord = undefined;
      
      // Notificar o serviço de chat para limpar sua hierarquia
      if (this.router) {
        setTimeout(() => {
          try {
            // Use injector for safer dependency resolution
            const aiChatService = this.injector.get(AiChatService);
            if (aiChatService) {
              aiChatService.resetHierarchyData();
            }
          } catch (e) {
            console.error('Não foi possível obter o AiChatService:', e);
          }
        });
      }
    } else {
      // Código existente para outras rotas...
      if (segments.length > 0) {
        // Determinar o tipo de view (list, view, edit, etc.)
        context.viewType = segments[0];
        
        // Padrões de URL comuns
        if (segments[0] === 'list' && segments.length > 1) {
          context.collection = segments[1];
        } 
        else if (['view', 'edit', 'new'].includes(segments[0]) && segments.length > 1) {
          context.collection = segments[1];
          if (segments.length > 2) context.id = segments[2];
        }
        else if (segments[0] === 'view-ficha' && segments.length >= 3) {
          context.collection = segments[1];
          context.id = segments[2];
          
          if (segments.length >= 5 && segments[3] === 'fichas') {
            context.subcollection = segments[4];
            
            if (segments.length >= 6) context.itemId = segments[6];
          }
        }
        else if (segments[0] === 'edit-ficha' && segments.length >= 7) {
          context.collection = segments[1];
          context.id = segments[2];
          
          if (segments[3] === 'fichas') {
            context.subcollection = segments[4];
            if (segments[6]) context.itemId = segments[6];
          }
        }
      }
    }
    
    console.log('Contexto de navegação atualizado:', context);
    this.navigationContextSubject.next(context);
  }

  // Métodos para acessar o contexto de navegação
  getCurrentCollection(): string | undefined {
    return this.navigationContextSubject.value.collection;
  }
  
  getCurrentId(): string | undefined {
    return this.navigationContextSubject.value.id;
  }
  
  getCurrentSubcollection(): string | undefined {
    return this.navigationContextSubject.value.subcollection;
  }

  setChatbotExpanded(expanded: boolean): void {
    this._chatbotExpanded.next(expanded);
  }

  // Método para atualizar o contexto manualmente
  updateNavigationContext(context: Partial<NavigationContext>): void {
    const currentContext = this.navigationContextSubject.value;
    const updatedContext = { ...currentContext, ...context };
    this.navigationContextSubject.next(updatedContext);
  }

  // Adicionar ao UserService - método para atualizar o registro atual
  public setCurrentRecord(id: string, data: any): void {
    // Verificar se estamos criando um novo registro
    const isNewRecord = id && !id.includes('/') && this.router.url.includes('/new/');
    
    // Se for novo registro, fazer sanitização para remover campos de subcoleções
    let sanitizedData = data;
    if (isNewRecord) {
      // Determinar quais campos pertencem à coleção principal
      const collectionType = this.getCurrentCollection();
      const mainFields = this.getMainFieldsForCollection(collectionType);
      
      // Filtrar apenas os campos que pertencem à coleção principal
      sanitizedData = Object.keys(data)
        .filter(key => mainFields.includes(key) || 
                ['id', 'nome', 'email', 'telefone', 'cpf', 'created_at', 'updated_at'].includes(key))
        .reduce<Record<string, any>>((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {} as Record<string, any>);
        
      console.log('Dados sanitizados para novo registro:', sanitizedData);
    }
  
    const currentContext = this.navigationContextSubject.value;
    const updatedContext = { 
      ...currentContext, 
      currentRecord: { 
        id: id, 
        data: sanitizedData 
      } 
    };
    
    console.log('UserService: Atualizando registro atual:', updatedContext);
    this.navigationContextSubject.next(updatedContext);
  }
  
  // Método auxiliar para determinar os campos principais de cada coleção
  private getMainFieldsForCollection(collectionType?: string): string[] {
    switch(collectionType) {
      case 'pacientes':
        return ['nome', 'email', 'telefone', 'cpf', 'rg', 'nascimento', 'endereco',
                'bairro', 'cidade', 'estado', 'cep', 'convenio', 'codigo', 'obs'];
      case 'dentistas':
        return ['nome', 'email', 'telefone', 'cpf', 'cro', 'especialidade'];
      // Adicionar outras coleções conforme necessário
      default:
        return [];
    }
  }

  // CORRIGIDO: Convertido para async/await
  async updateUserData(userData: any): Promise<void> {
    try {
      // Verificar se o usuário está autenticado
      const user = await this.afAuth.currentUser;
      if (!user) {
        console.error('Nenhum usuário autenticado');
        return;
      }

      // Atualizar o perfil do usuário
      await this.firestore
        .collection('users')
        .doc(user.uid)
        .set(userData, { merge: true });
        
      console.log('Dados do usuário atualizados com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  }

  // Converta o método para async
  public async getCollectionName(collectionId: string): Promise<string> {
    try {
      const doc = await firstValueFrom(this.firestore.doc(`collections/${collectionId}`).get());
      if (doc.exists) {
        const data = doc.data() as { name: string };
        return data.name;
      }
      return collectionId; // Retorna o ID se o documento não existir
    } catch (error) {
      console.error('Erro ao obter nome da coleção:', error);
      return collectionId; // Retorna o ID em caso de erro
    }
  }

  // Adicionar este método ao UserService
  saveAdditionalUserData(userId: string, userData: any): Promise<void> {
    return this.firestore.collection('users').doc(userId).set(userData, { merge: true });
  }
}
