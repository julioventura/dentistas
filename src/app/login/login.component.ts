import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Use AngularFireAuth
import { UserService } from '../shared/user.service';  // Importe o UserService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private auth: AngularFireAuth,  // Usando AngularFireAuth para autenticação
    private router: Router,
    private userService: UserService  // Injete o UserService
  ) {}

  onLogin() {
    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Verificação se o usuário não é null
        if (user) {
          // Aqui você pode definir os dados do usuário no serviço
          this.userService.setUser({
            displayName: user.displayName || '',  // Garantir que não será null
            email: user.email || '',  // Garantir que não será null
            uid: user.uid || ''  // Garantir que não será null
          });

          // Agora você pode usar 'user' para acessar dados do usuário, como o displayName ou email
          console.log("LOGIN: ");
          console.log(user.displayName || user.email);

          // Redireciona para a página home após login bem-sucedido
          this.router.navigate(['/home']);
        } else {
          console.error('Erro: usuário retornado é null.');
        }
      })
      .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert('Email ou senha incorretos.');
      });
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
