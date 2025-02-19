import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Usando AngularFireAuth
import { Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service'; // Import FirestoreService
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { ConfigService } from '../shared/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  nome: string = '';  // Variável para armazenar o nome do usuário logado
  username: string | null = null;  // Variável para armazenar o username do usuário logado
  new_window: boolean = false;

  // Lista de ícones visíveis
  visibleIcons: { [key: string]: boolean } = {
    pacientes: true,
    alunos: true,
    professores: true,
    dentistas: true,
    equipe: true,
    proteticos: true,
    indicador: false,
    dentais: false,
    empresas: false,
    perfil: true,
    homepage: true,
  };

  private userId: string | null = null;


  // Controle de visibilidade do menu de configuração
  // showConfig = false;

  constructor(
    private auth: AngularFireAuth,  
    private router: Router,
    public config: ConfigService,
    private firestore: AngularFirestore, 
    private firestoreService: FirestoreService<any>, // Usando FirestoreService para buscar o username
  ) { }

  ngOnInit() {
    // Uso do AngularFireAuth para obter o usuário logado
    this.auth.user.subscribe(user => {
      if (user && user.email) {
        this.nome = this.capitalize(user.displayName || user.email || 'Usuário');
        this.userId = user.uid;
        this.loadUserData(user.email);  // Carregar os dados do usuário pelo email

        if (user.email == 'julio@dentistas.com.br') {
          this.config.is_admin = true;
        }

        this.loadIconConfig();

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

  // toggleConfig() {
  //   this.showConfig = !this.showConfig;
  // }


  // Carrega as configurações de ícones do Firestore
  loadIconConfig() {
    if (!this.userId) return;

    // Obtém o documento com as configurações do usuário no Firestore
    this.firestore.doc(`/users/${this.userId}/settings/HomeConfig`).get().subscribe(doc => {
      if (doc.exists) {
        this.visibleIcons = doc.data() as { [key: string]: boolean };
      } else {
        console.log("Nenhuma configuração personalizada encontrada. Usando configurações padrão.");
      }
    });
  }


 saveIconConfig() {
    if (this.userId) {
      this.firestore.doc(`/users/${this.userId}/settings/HomeConfig`).set(this.visibleIcons)
        .then(() => console.log("Configurações salvas com sucesso!"))
        .catch(error => console.error("Erro ao salvar configurações:", error));
    }
  }

  
// Função para carregar os dados do usuário, incluindo o username
  loadUserData(email: string): void {
    this.firestoreService.getRegistroById('usuarios/dentistascombr/users', email).subscribe(userData => {
      if (userData && userData.username) {
        this.username = userData.username;
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
