import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { UserService } from '../shared/user.service'; // Importa o serviço de usuário
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Importa a autenticação para capturar o usuário logado

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  collection!: string;
  registro: any = {}; // O registro começa vazio para evitar problemas de inicialização
  isNew = false; // Identifica se é um novo registro ou edição de um existente
  userId: string | null = null; // Armazena o ID do usuário logado
  id: string | null = null; // Armazena o ID do registro

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>, // Serviço genérico
    private navegacaoService: NavegacaoService,
    private userService: UserService, // Serviço de usuário
    private afAuth: AngularFireAuth // Serviço de autenticação
  ) { }

  ngOnInit() {
    // Verifica se o usuário está logado e pega o ID do usuário
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid; // Define o ID do usuário logado

        this.collection = this.route.snapshot.paramMap.get('collection')!;
        this.id = this.route.snapshot.paramMap.get('id');

        if (this.id) {
          this.loadRegistro(this.id);
        } else {
          this.isNew = true;
          this.gerarNovoRegistro(); // Se não houver id, cria um novo registro
        }
      }
    });
  }

  gerarNovoRegistro() {
    if (!this.userId) return; // Verifica se o userId está disponível

    // Gera um novo código e id para o registro na subcoleção do usuário logado
    this.firestoreService.gerarProximoCodigo(`users/${this.userId}/${this.collection}`).then(novoCodigo => {
      const id = this.firestoreService.createId(); // Gera o ID único no momento da criação
      this.registro = {
        id, // O ID gerado será usado para operações no Firestore
        codigo: novoCodigo,
        nome: '',
        sexo: 'Masculino', // Valor padrão
        nascimento: '',
        cpf: '',
        telefone: ''
      };

      // Adiciona o registro recém-criado à subcoleção do usuário logado
      this.firestoreService.addRegistro(`users/${this.userId}/${this.collection}`, this.registro).then(() => {
        console.log('Novo registro criado com sucesso:', this.registro);
      }).catch(error => {
        console.error('Erro ao criar o novo registro:', error);
      });
    });
  }

  loadRegistro(id: string) {
    if (!this.userId) return; // Verifica se o userId está disponível

    // Carrega o registro da subcoleção do usuário logado usando o id
    this.firestoreService
    .getRegistroById(`users/${this.userId}/${this.collection}`, id).subscribe(registro => {
      if (registro) {
        this.registro = registro;
        console.log('Registro carregado:', this.registro);
      } else {
        console.error('Registro não encontrado com o ID:', id);
        this.router.navigate([`/${this.collection}`]); // Redireciona se não encontrar o registro
      }

      // Inicializa campos vazios com valores padrão
      this.registro = this.registro || { id };
      this.registro.nome = this.registro.nome || '';
      this.registro.sexo = this.registro.sexo || 'Masculino'; // Valor padrão para sexo
      this.registro.nascimento = this.registro.nascimento || '';
      this.registro.cpf = this.registro.cpf || '';
      this.registro.telefone = this.registro.telefone || '';
    });
  }

  voltar() {
    this.navegacaoService.goBack();
  }

  salvar() {
    if (this.registro && this.registro.id && this.userId) {
      console.log('Salvando registro:', this.registro);

      // Usa o ID gerado pelo Firestore para atualizar o registro na subcoleção do usuário logado
      this.firestoreService.updateRegistro(`users/${this.userId}/${this.collection}`, this.registro.id, this.registro)
        .then(() => {
          this.router.navigate([`/view/${this.collection}`, this.registro.id]);
        })
        .catch(error => {
          console.error('Erro ao salvar o registro:', error);
          alert('Erro ao salvar o registro. Por favor, tente novamente.');
        });
    } else {
      console.error('Registro inválido ou sem ID:', this.registro);
      alert('Registro inválido ou sem ID. Não é possível salvar.');
    }
  }
}
