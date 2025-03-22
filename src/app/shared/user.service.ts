import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreService } from '../shared/firestore.service'; // Serviço para manipular o Firestore
import firebase from 'firebase/compat/app'; // Importa firebase para usar firebase.User
import { Observable, of, from, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

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

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService<any>
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
  createUserInFirestore(user: firebase.User): void {
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
          provider: user.providerData[0]?.providerId || 'emailAndPassword', // Registra o provedor
          createdAt: new Date(),
        }).then(() => {
          console.log('Usuário criado na coleção usuarios/dentistascombr com email como chave.');
        }).catch((error) => {
          console.error('Erro ao criar o usuário na coleção usuarios/dentistascombr:', error);
        });
      } else {
        console.log('Usuário já existe na coleção usuarios/dentistascombr');
      }
    });
  }

  // Método para chamar após o login bem-sucedido
  loginSuccess(user: firebase.User) {
    this.createUserInFirestore(user); // Cria um documento na coleção 'usuarios/dentistascombr' para o usuário
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

  setChatbotExpanded(expanded: boolean): void {
    this._chatbotExpanded.next(expanded);
  }
}
