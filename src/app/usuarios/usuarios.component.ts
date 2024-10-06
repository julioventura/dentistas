import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavegacaoService } from '../shared/navegacao.service';
import { FirestoreService } from '../shared/firestore.service';  // Agora a interface Usuario está corretamente exportada
import { Usuario } from './usuario.model';  // Agora a interface Usuario está corretamente exportada

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  totalUsuarios = 0; // Atualizado para ser dinâmico com Firestore
  page = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private router: Router, 
    private navegacaoService: NavegacaoService, 
    private firestoreService: FirestoreService<Usuario>  // Injeta o FirestoreService
  ) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    // Carrega os usuários do Firestore
    this.firestoreService.getRegistros('usuarios').subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.totalUsuarios = this.usuarios.length;
      this.totalPages = Math.ceil(this.totalUsuarios / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    });
  }

  setPage(page: number) {
    this.page = page;
    this.loadUsuarios(); // Recarrega os usuários com a nova página
  }

  // Método para ir para a página home
  goHome() {
    this.router.navigate(['/home']);
  }

  // Método para voltar para a página anterior
  voltar() {
    this.navegacaoService.goBack();  // Chama o método do serviço para voltar
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadUsuarios();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsuarios();
    }
  }

  // Método para navegar para a ficha do usuário
  verFicha(id: string) {
    console.log("Navegando para a ficha do usuário com ID:", id);  // Verifica o valor de 'id'
    this.router.navigate(['/view/usuarios', id]);  // Navega para o componente view, passando a coleção 'usuarios'
  }

  adicionar() {
    const novoUsuario: Usuario = {
      id: this.firestoreService.createId(),  // Gera um novo ID automaticamente
      nome: '',
      sexo: '',
      cpf: '',
      telefone: '',
      nascimento: ''
    };

    // Adiciona o novo usuário ao Firestore
    this.firestoreService.addRegistro('usuarios', novoUsuario).then(() => {
      // Após adicionar, redireciona para a página de edição com o ID do novo usuário
      this.router.navigate(['/edit/usuarios', novoUsuario.id]);
    }).catch(error => {
      console.error('Erro ao adicionar novo usuário:', error);
      alert('Erro ao adicionar novo usuário.');
    });
  }
}
