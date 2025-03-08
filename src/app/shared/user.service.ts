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

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService<any>
  ) { }

  userEmail: string | null = null; // Email do usuário logado
  user: any = {}; // Dados do perfil

  // Novo objeto centralizado para o perfil do usuário
  private _userProfile: any = null;
  // Observable para permitir componentes reagirem a mudanças
  private userProfileSubject = new BehaviorSubject<any>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  // Getter para userProfile
  get userProfile(): any {
    return this._userProfile;
  }

  // Setter para userProfile - atualiza também o Subject para notificar componentes
  setUserProfile(profile: any): void {
    console.log('UserService: Setting userProfile', profile);
    this._userProfile = profile;
    this.userProfileSubject.next(profile);
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

  // NOVO MÉTODO: Atualizar perfil completo
  updateUserProfile(userEmail: string, profileData: any): Promise<void> {
    if (!userEmail) {
      return Promise.reject('Email do usuário não fornecido');
    }
    
    // Atualizar o userProfile local ao mesmo tempo que salva no Firestore
    this.setUserProfile(profileData);
    
    return this.firestore.collection('usuarios')
      .doc('dentistascombr')
      .collection('users')
      .doc(userEmail)
      .update(profileData);
  }

  // Método para recuperar perfil do usuário pelo username
  loadUserProfileByUsername(username: string): Observable<any> {
    return this.firestoreService.getRegistroByUsername('usuarios/dentistascombr/users', username)
      .pipe(
        tap(userProfiles => {
          if (userProfiles && userProfiles.length > 0) {
            this.setUserProfile(userProfiles[0]);
          }
        })
      );
  }
}
