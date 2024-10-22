import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FirestoreService } from '../shared/firestore.service'; // Serviço para manipular o Firestore
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Serviço de autenticação
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user: any = {}; // Dados do perfil
  userEmail: string | null = null; // Email do usuário logado

  constructor(
    private userService: UserService,
    private firestoreService: FirestoreService<any>,
    private auth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  // Carregar dados do usuário autenticado
  loadUserData(): void {
    this.auth.authState.subscribe((authUser) => {
      if (authUser && authUser.email) {
        this.userEmail = authUser.email; // Obtém o email do usuário logado
        console.log('Email do usuário carregado:', this.userEmail);

        // Busca os dados do perfil no Firestore usando o email do usuário
        this.firestoreService.getRegistroById('usuarios/dentistascombr/users', this.userEmail).subscribe((userData) => {
          if (userData) {
            this.user = userData;
            console.log('Dados do usuário carregados:', this.user);
          } else {
            console.log('Nenhum dado encontrado para este usuário.');
          }
        });
      } else {
        console.error('Usuário não autenticado ou email não disponível.');
      }
    });
  }

  // Função para salvar os dados do perfil
  salvar(): void {
    if (this.userEmail) {
      console.log('Tentando salvar dados para o email:', this.userEmail);
      console.log('Dados a serem salvos:', this.user);

      // Verificar se todos os campos essenciais estão preenchidos
      if (!this.user || Object.keys(this.user).length === 0) {
        console.error('Erro: Dados do perfil estão vazios ou incompletos.');
        alert('Erro: Dados do perfil estão incompletos.');
        return;
      }

      // Atualiza os dados do perfil no Firestore com base no email do usuário
      this.firestoreService.updateRegistro('usuarios/dentistascombr/users', this.userEmail, this.user)
        .then(() => {
          console.log('Perfil atualizado com sucesso!');
          alert('Dados atualizados com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao atualizar os dados do perfil:', error);
          alert(`Erro ao salvar os dados: ${error.message}`);
        });
    } else {
      console.error('Email do usuário não encontrado.');
    }
  }

  // Função para voltar à página anterior
  voltar(): void {
    this.router.navigate(['/']); // Exemplo: retorna para a página inicial
  }
}
