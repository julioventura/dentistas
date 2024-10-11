import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { UserService } from '../shared/user.service'; // Importa o serviço de usuário
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa a autenticação para capturar o usuário logado
import { CamposService } from '../shared/campos.service'; // Serviço de campos

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  collection!: string;
  registro: any = null; // O registro começa como null para verificar posteriormente
  id!: string;
  isLoading = true; // Variável para exibir o carregamento
  titulo_da_pagina: string = '';
  userId: string | null = null; // Armazena o ID do usuário logado
  campos: any[] = []; // Campos da coleção

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>, // Serviço genérico
    private navegacaoService: NavegacaoService,
    private userService: UserService, // Serviço de usuário
    private afAuth: AngularFireAuth, // Serviço de autenticação
    private camposService: CamposService // Serviço de campos
  ) { }

  ngOnInit() {
    // Pega a coleção da URL (ex: 'pacientes', 'alunos')
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log("Registros de ");
    console.log(this.collection);

    // Verifica se a coleção foi definida corretamente
    if (this.collection) {
      this.titulo_da_pagina = this.collection.charAt(0).toUpperCase() + this.collection.slice(1).toLowerCase();
      this.carregarCampos(); // Carrega os campos da coleção selecionada
    } else {
      console.error('Erro: A coleção não foi definida corretamente.');
      this.titulo_da_pagina = 'Coleção não definida'; // Mensagem de fallback
    }

    // Verifica se o usuário está logado e pega o ID do usuário
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid; // Define o ID do usuário logado

        if (this.id && this.collection) {
          this.titulo_da_pagina = this.titulo_view(this.collection);
          console.log('Título = ' + this.titulo_da_pagina);
          this.loadRegistro(this.id); // Carrega o registro após definir os campos
        }
      }
    });
  }

  carregarCampos() {
    // Se inscreve no Observable retornado pelo serviço e atribui os campos ao array
    this.camposService.getFormularios(this.collection).subscribe((campos: any[]) => {
      this.campos = campos || []; // Inicializa com um array vazio se não houver campos
    });
  }

  titulo_view(collection: string) {
    // Titulo da página
    switch (this.collection) {
      case 'usuarios':
        return 'Usuário';
      case 'professores':
        return 'Professor';
      case 'alunos':
        return 'Aluno';
      case 'pacientes':
        return 'Paciente';
      case 'equipe':
        return 'Equipe';
      default:
        return 'Registro';
    }
  }

  loadRegistro(id: string) {
    if (!this.userId) return; // Verifica se o userId está disponível

    // Busca o registro dentro da subcoleção do usuário logado
    this.firestoreService.getRegistroById(`users/${this.userId}/${this.collection}`, id).subscribe(
      (registro) => {
        this.registro = registro;
        this.isLoading = false; // Desativa o modo de carregamento após receber os dados

        if (!this.registro) {
          console.error(`Registro com ID ${id} não encontrado na coleção ${this.collection}`);
          this.router.navigate([`/${this.collection}`]); // Redireciona para a página de listagem
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Erro ao carregar registro:', error);
        this.router.navigate([`/${this.collection}`]); // Redireciona em caso de erro
      }
    );
  }

  voltar() {
    console.log("voltar()");
    console.log(this.collection);
    this.router.navigate([`/registros/${this.collection}`]); // Redireciona para o componente da coleção correspondente
  }

  editarRegistro() {
    this.router.navigate([`/edit/${this.collection}`, this.id]);
  }

  deletarRegistro() {
    if (confirm('Você tem certeza que deseja excluir este registro?')) {
      this.firestoreService.deleteRegistro(`users/${this.userId}/${this.collection}`, this.id)
        .then(() => {
          this.router.navigate([`/${this.collection}`]); // Redireciona para a página de listagem após exclusão
        })
        .catch((error) => {
          console.error('Erro ao excluir o registro:', error);
        });
    }
  }
}
