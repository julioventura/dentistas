import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Importa firebase para usar firebase.User
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  // Método para pegar os dados do usuário autenticado
  getUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
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
}