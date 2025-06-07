// Alteração: remoção de logs de depuração (console.log)
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Autenticação
import { UserService } from '../shared/services/user.service';  // Serviço de usuário
import firebase from 'firebase/compat/app'; // Firebase
import { MatDialog } from '@angular/material/dialog'; // MatDialog
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Novo: controlar rede do Firestore
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component'; // Componente de diálogo

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  hidePassword: boolean = true; // Controla a visibilidade da senha
  // Novo: impede múltiplos envios de login
  isSubmitting: boolean = false;
  // Novo: impede múltiplos cadastros simultâneos
  isCreatingAccount: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private firestore: AngularFirestore // Novo: necessário para habilitar rede
  ) { }

  // Alteração: função passou a ser assíncrona para capturar erros sem gerar múltiplos logs
  // Correção: verificação assíncrona com remoção de espaços
  async onLogin() {

    // Novo: evita múltiplas submissões simultâneas
    if (this.isSubmitting) {
      return;
    }

    // Correção: remove espaços extras do email e da senha digitados
    this.email = this.email.trim();
    this.password = this.password.trim();

    if (!this.email || !this.password) {
      alert('Por favor, preencha o email e a senha.');
      return;
    }

    // Verifica se o email está em um formato válido
    if (!this.validateEmail(this.email)) {
      alert('Por favor, insira um email válido.');
      return;
    }

    // Novo: define envio em andamento somente após as validações
    this.isSubmitting = true;

    try {
      // Chamada assíncrona ao Firebase
      const userCredential = await this.auth.signInWithEmailAndPassword(this.email, this.password);

      const user: firebase.User | null = userCredential.user;

      if (user) {
        // Novo: reativa a rede do Firestore após login
        try {
          await this.firestore.firestore.enableNetwork();
        } catch (e) {
          console.error('Erro ao habilitar rede do Firestore:', e);
        }
        this.userService.loginSuccess(user);
        this.router.navigate(['/']); // Alterado para redirecionar para a página inicial
      } else {
        // Comentado para evitar log extra de erro
        console.error('Erro: usuário retornado é null.');
      }
    } catch (error: any) {
      // Comentado: captura da exceção para evitar que o Angular emita outros logs
      const errorCode = error.code;

      // Corrigido: registrar apenas quando o usuário não existir
      if (errorCode === 'auth/user-not-found') {
        this.promptUserRegistration();
      // Corrigido: tratar credencial inválida como senha incorreta
      } else if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
        alert('Senha incorreta.');
      } else if (errorCode === 'auth/invalid-email') {
        alert('O email fornecido é inválido.');
      } else {
        alert('Erro ao fazer login. Por favor, tente novamente.');
      }
    } finally {
      // Novo: libera o botão de login
      this.isSubmitting = false;
    }
  }

  // Atualize o método que recebe o resultado do diálogo de cadastro
  promptUserRegistration() {
    const dialogRef = this.dialog.open(SignupDialogComponent, {
      width: '450px',
      data: { email: this.email },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirm) {
        this.createAccount(result.name, result.username, result.email);
      } else {
      }
    });
  }

  // Atualize o método createAccount para receber e usar nome e username
  createAccount(name: string, username: string, email: string) {
    // Novo: evita múltiplos cadastros simultâneos
    if (this.isCreatingAccount) {
      return;
    }
    this.isCreatingAccount = true;

    this.auth.createUserWithEmailAndPassword(email, this.password)
      .then((userCredential) => {
        const user: firebase.User | null = userCredential.user;

        if (user) {
          // Atualiza o perfil do usuário com o nome fornecido
          user.updateProfile({
            displayName: name
          }).then(async () => {
            // Novo: reativa a rede do Firestore após criar conta
            try {
              await this.firestore.firestore.enableNetwork();
            } catch (e) {
              console.error('Erro ao habilitar rede do Firestore:', e);
            }
            // Chama o método loginSuccess com nome e username
            this.userService.loginSuccess(user, name, username);
            // Navega para a página inicial após cadastro bem-sucedido
            this.router.navigate(['/']);
          }).catch(error => {
            console.error('Erro ao atualizar o perfil do usuário:', error);
            alert('Erro ao atualizar o perfil. Por favor, tente novamente.');
          });
        }
      })
      .catch(error => {
        // Correção: tratamento detalhado de erros ao criar conta
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          alert('Este email já está em uso.');
        } else {
          alert('Erro ao criar conta. Por favor, tente novamente.');
        }
      })
      .finally(() => {
        // Novo: libera o estado de criação
        this.isCreatingAccount = false;
      });
  }

  // Função para validar o formato do email
  validateEmail(email: string): boolean {
    // Expressão regular simples para validar o formato do email
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  togglePassword() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const passwordIcon = document.getElementById('password-icon');

    if (passwordInput && passwordIcon) {  // Verificando se os elementos existem
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
      }
    }
  }
}
