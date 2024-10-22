import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa a autenticação do Firebase
import firebase from 'firebase/compat/app'; // Importa o firebase para usar firebase.User

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  user: firebase.User | null = null; // Armazena o usuário logado

  constructor(
    private router: Router,
    private auth: AngularFireAuth, // Injeta o serviço de autenticação
  ) { }

  ngOnInit() {
    // Verifica se há um usuário logado e armazena as informações
    this.auth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  // Método para logout
  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']); // Redireciona para a página de login após o logout
    });
  }

  // Método para navegação dinâmica
  go(component: string) {
    this.router.navigate(['/' + component]);
  }
}
