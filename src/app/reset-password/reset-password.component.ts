import { Component } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Importando FormsModule

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  email: string = '';

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    sendPasswordResetEmail(this.auth, this.email)
      .then(() => {
        alert('Um email para redefinição de senha foi enviado.');
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Erro ao enviar email de redefinição de senha:', error);
        alert('Ocorreu um erro ao tentar enviar o email.');
      });
  }
}
