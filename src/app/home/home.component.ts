import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Usando AngularFireAuth
import { Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service'; // Import FirestoreService

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nome: string = '';  // Variável para armazenar o nome do usuário logado
  username: string | null = null;  // Variável para armazenar o username do usuário logado
  new_window: boolean = false;
  is_admin: boolean = false;

  
  constructor(
    private auth: AngularFireAuth,  // Usando AngularFireAuth
    private router: Router,
    private firestoreService: FirestoreService<any> // Usando FirestoreService para buscar o username
  ) { }

  ngOnInit() {
    // Uso do AngularFireAuth para obter o usuário logado
    this.auth.user.subscribe(user => {
      if (user && user.email) {
        this.nome = this.capitalize(user.displayName || user.email || 'Usuário');
        this.loadUserData(user.email);  // Carregar os dados do usuário pelo email

        if (user.email == 'julio@dentistas.com.br') {
          this.is_admin = true;
        }
      } else {
        console.log('Nenhum usuário logado.');
        // Redireciona para a página de login se o usuário não estiver logado
        this.router.navigate(['/login']);
      }
    });
  }

  // Função para capitalizar a primeira letra de cada palavra
  capitalize(text: string): string {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Função para carregar os dados do usuário, incluindo o username
  loadUserData(email: string): void {
    this.firestoreService.getRegistroById('usuarios/dentistascombr/users', email).subscribe(userData => {
      if (userData && userData.username) {
        this.username = userData.username; // Obter o username do Firestore
        console.log('Username carregado:', this.username);
      } else {
        console.log('Nenhum username encontrado para este usuário.');
      }
    });
  }

  mostrarAlerta(): void {
    alert('Acesso reservado ao administrador');
  }

  // Método para navegação dinâmica
  go(component: string, new_window: boolean = false) {
    this.new_window = new_window;
    if (new_window) {
      const introUrl = `/${component}/intro`;
      this.router.navigate([introUrl]); // Navega para a introdução no próprio app
    } else {
      this.router.navigate(['/' + component]);
    }
  }
  
}
