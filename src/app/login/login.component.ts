// Alteração: remoção de logs de depuração (console.log)
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component'; // Componente de diálogo

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  // Controle das abas
  selectedTab = 0;

  // Login
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;
  isSubmitting: boolean = false;

  // Signup
  signupEmail: string = '';
  signupPassword: string = '';
  signupName: string = '';
  signupUsername: string = '';
  hideSignupPassword: boolean = true;
  isCreatingAccount: boolean = false;

  // Reset password
  resetEmail: string = '';
  isResetting: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  // LOGIN
  async onLogin(): Promise<void> {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(this.email.trim(), this.password.trim());
      const user = userCredential.user;
      if (user) {
        // ADICIONAR: Console log dos dados de autenticação
        console.log('=== DADOS DE AUTENTICAÇÃO - LOGIN ===');
        console.log('Email:', user.email);
        console.log('UID:', user.uid);
        console.log('Display Name:', user.displayName);
        console.log('Email Verified:', user.emailVerified);
        console.log('Creation Time:', user.metadata.creationTime);
        console.log('Last Sign In Time:', user.metadata.lastSignInTime);
        console.log('Provider Data:', user.providerData);
        console.log('=== FIM DADOS DE AUTENTICAÇÃO ===');
        
        this.userService.loginSuccess(user);
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        alert('Usuário não encontrado. Crie uma conta.');
        this.selectedTab = 1;
        this.signupEmail = this.email;
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert('Senha incorreta.');
      } else if (error.code === 'auth/invalid-email') {
        alert('O email fornecido é inválido.');
      } else {
        alert('Erro ao fazer login. Por favor, tente novamente.');
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  // SIGNUP
  async onSignup(): Promise<void> {
    if (this.isCreatingAccount) return;
    this.isCreatingAccount = true;
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(this.signupEmail.trim(), this.signupPassword.trim());
      const user = userCredential.user;
      if (user) {
        await user.updateProfile({ displayName: this.signupName });
        
        // ADICIONAR: Console log dos dados de autenticação
        console.log('=== DADOS DE AUTENTICAÇÃO - SIGNUP ===');
        console.log('Email:', user.email);
        console.log('UID:', user.uid);
        console.log('Display Name:', user.displayName);
        console.log('Email Verified:', user.emailVerified);
        console.log('Creation Time:', user.metadata.creationTime);
        console.log('Last Sign In Time:', user.metadata.lastSignInTime);
        console.log('Provider Data:', user.providerData);
        console.log('Nome fornecido:', this.signupName);
        console.log('Username fornecido:', this.signupUsername);
        console.log('=== FIM DADOS DE AUTENTICAÇÃO ===');
        
        this.userService.loginSuccess(user, this.signupName, this.signupUsername);
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Este email já está em uso.');
      } else {
        alert('Erro ao criar conta. Por favor, tente novamente.');
      }
    } finally {
      this.isCreatingAccount = false;
    }
  }

  // RESET PASSWORD
  async onResetPassword(): Promise<void> {
    if (this.isResetting) return;
    this.isResetting = true;
    try {
      await this.auth.sendPasswordResetEmail(this.resetEmail.trim());
      alert('Um email para redefinição de senha foi enviado.');
      this.selectedTab = 0;
    } catch (error) {
      alert('Ocorreu um erro ao tentar enviar o email.');
    } finally {
      this.isResetting = false;
    }
  }
}
