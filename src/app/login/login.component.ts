import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Autenticação
import { UserService } from '../shared/user.service';  // Serviço de usuário
import firebase from 'firebase/compat/app'; // Firebase
import { MatDialog } from '@angular/material/dialog'; // MatDialog
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

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  onLogin() {
    console.log("Tentando fazer login com email:", this.email);

    if (!this.email || !this.password) {
      alert('Por favor, preencha o email e a senha.');
      return;
    }

    // Verifica se o email está em um formato válido
    if (!this.validateEmail(this.email)) {
      alert('Por favor, insira um email válido.');
      return;
    }

    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        const user: firebase.User | null = userCredential.user;

        if (user) {
          console.log("Usuário autenticado com sucesso:", user.email);
          this.userService.loginSuccess(user);
          this.router.navigate(['/']); // Alterado para redirecionar para a página inicial
        } else {
          console.error('Erro: usuário retornado é null.');
        }
      })
      .catch(error => {
        console.error("Erro ao fazer login:", error); // Log detalhado do erro

        const errorCode = error.code;

        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
          console.log("Usuário não encontrado ou credenciais inválidas, iniciando criação de conta...");
          this.promptUserRegistration();
        } else if (errorCode === 'auth/wrong-password') {
          alert('Senha incorreta.');
        } else if (errorCode === 'auth/invalid-email') {
          alert('O email fornecido é inválido.');
        } else {
          alert('Erro ao fazer login. Por favor, tente novamente.');
        }
      });
  }

  promptUserRegistration() {
    console.log("Abrindo diálogo de registro para o email:", this.email);

    const dialogRef = this.dialog.open(SignupDialogComponent, {
      data: { email: this.email },
      width: '450px',
      height: '500px',
      panelClass: 'modern-dialog',
      disableClose: true // Evita fechamento ao clicar fora ou pressionar ESC
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirm) {
        console.log("Usuário confirmou a criação de conta com o nome:", result.name);
        this.createAccount(result.name);
      } else {
        console.log("Criação de conta cancelada pelo usuário.");
      }
    });
  }

  createAccount(name: string) {
    console.log("Criando conta para o email:", this.email);

    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        const user: firebase.User | null = userCredential.user;

        if (user) {
          console.log("Conta criada com sucesso para o email:", user.email);
          // Atualiza o perfil do usuário com o nome fornecido
          user.updateProfile({ displayName: name }).then(() => {
            console.log("Perfil do usuário atualizado com o nome:", name);
            this.userService.loginSuccess(user); // Atualiza os dados no serviço de usuário
            this.router.navigate(['/']); // Alterado para redirecionar para a página inicial
          }).catch(error => {
            console.error('Erro ao atualizar o perfil do usuário:', error);
            alert('Erro ao atualizar o perfil. Por favor, tente novamente.');
          });
        } else {
          console.error('Erro: usuário retornado é null após criação da conta.');
        }
      })
      .catch(error => {
        console.error('Erro ao criar conta:', error); // Log detalhado do erro

        const errorCode = error.code;

        if (errorCode === 'auth/email-already-in-use') {
          alert('Este email já está em uso.');
        } else if (errorCode === 'auth/invalid-email') {
          alert('O email fornecido é inválido.');
        } else if (errorCode === 'auth/weak-password') {
          alert('A senha é muito fraca. Tente uma senha mais forte.');
        } else {
          alert('Erro ao criar conta. Por favor, tente novamente.');
        }
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
