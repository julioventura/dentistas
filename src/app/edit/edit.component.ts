import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  registro: any = {};  // O registro começa vazio para evitar problemas de inicialização
  collection!: string;
  isNew = false;  // Identifica se é um novo registro ou edição de um existente

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,  // Serviço genérico
    private navegacaoService: NavegacaoService
  ) {}

  ngOnInit() {
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadRegistro(id);
    } else {
      this.isNew = true;
      this.gerarNovoRegistro();  // Se não houver id, cria um novo registro
    }
  }

  gerarNovoRegistro() {
    // Gera um novo código e id para o registro
    this.firestoreService.gerarProximoCodigo(this.collection).then(novoCodigo => {
      const id = this.firestoreService.createId();  // Gera o ID único no momento da criação
      this.registro = {
        id,  // O ID gerado será usado para operações no Firestore
        codigo: novoCodigo,
        nome: '',
        sexo: 'Masculino',  // Valor padrão
        nascimento: '',
        cpf: '',
        telefone: ''
      };

      // Adiciona o registro recém-criado ao Firestore
      this.firestoreService.addRegistro(this.collection, this.registro).then(() => {
        console.log('Novo registro criado com sucesso:', this.registro);
      }).catch(error => {
        console.error('Erro ao criar o novo registro:', error);
      });
    });
  }

  loadRegistro(id: string) {
    // Carrega o registro usando o id, que é a chave do documento no Firestore
    this.firestoreService.getRegistros(this.collection).subscribe(registros => {
      this.registro = registros.find((registro: any) => registro.id === id);

      if (this.registro) {
        console.log('Registro carregado:', this.registro);
      } else {
        console.error('Registro não encontrado com o ID:', id);
      }

      // Inicializa campos vazios com valores padrão
      this.registro = this.registro || { id };
      this.registro.nome = this.registro.nome || '';
      this.registro.sexo = this.registro.sexo || 'Masculino';  // Valor padrão para sexo
      this.registro.nascimento = this.registro.nascimento || '';
      this.registro.cpf = this.registro.cpf || '';
      this.registro.telefone = this.registro.telefone || '';
    });
  }

  voltar() {
    this.navegacaoService.goBack();
  }

  salvar() {
    if (this.registro && this.registro.id) {
      console.log('Salvando registro:', this.registro);
  
      // Usa o ID gerado pelo Firestore para atualizar o registro
      this.firestoreService.updateRegistro(this.collection, this.registro.id, this.registro)
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
