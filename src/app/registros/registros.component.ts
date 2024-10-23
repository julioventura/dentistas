import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegacaoService } from '../shared/navegacao.service';
import { FirestoreService } from '../shared/firestore.service';
import { Registro } from './registro.model';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Usar AngularFireAuth
import { UserService } from '../shared/user.service'; // Serviço de usuário para pegar o ID
import { FormBuilder, FormGroup } from '@angular/forms'; // Reactive Forms
import { UtilService } from '../shared/util.service';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss']
})
export class RegistrosComponent implements OnInit {
  collection!: string;
  registros: Registro[] = [];
  totalRegistros = 0;
  page = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];
  userId: string | null = null; // ID do usuário logado
  isLoading = true;   // Indicador de carregamento  
  titulo_da_pagina: string = '';

  // Adiciona o formGroup
  registroForm!: FormGroup;

  // Definindo os campos dinâmicos
  campos: { nome: string, tipo: string, label: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navegacaoService: NavegacaoService,
    private firestoreService: FirestoreService<Registro>,
    private afAuth: AngularFireAuth,  // Usando AngularFireAuth para autenticação
    private userService: UserService, // Injeta o serviço de usuário
    private fb: FormBuilder, // Injeta o FormBuilder
    public util: UtilService

  ) { }

  ngOnInit() {
    // Pega a coleção da URL (ex: 'pacientes', 'dentistas')
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    console.log("Registros de " + this.collection);

    // Verifica se a coleção foi definida corretamente
    if (this.collection) {
      this.titulo_da_pagina = 'Lista de ' + this.util.capitalizar(this.collection);
      this.definirCampos(); // Define os campos dinâmicos com base na coleção
    } else {
      console.error('Erro: A coleção não foi definida corretamente.');
      this.titulo_da_pagina = 'Coleção não definida'; // Mensagem de fallback
    }

    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid; // Define o ID do usuário logado
        console.log("this.userId = " + user.uid);
        this.loadRegistros(); // Carrega os registros do usuário
        this.createForm(); // Cria o formulário dinâmico
      }
    });
  }

  definirCampos() {
    if (this.collection === 'pacientes') {
      this.campos = [
        { nome: 'nome', tipo: 'text', label: 'Nome' },
        { nome: 'cpf', tipo: 'text', label: 'CPF' },
        { nome: 'telefone', tipo: 'text', label: 'Telefone' },
        { nome: 'sexo', tipo: 'text', label: 'Sexo' },
        { nome: 'nascimento', tipo: 'date', label: 'Data de Nascimento' }
      ];
    } else if (this.collection === 'alunos') {
      this.campos = [
        { nome: 'nome', tipo: 'text', label: 'Nome do Aluno' },
        { nome: 'cpf', tipo: 'text', label: 'CPF do Aluno' },
        { nome: 'telefone', tipo: 'text', label: 'Telefone do Aluno' },
        { nome: 'curso', tipo: 'text', label: 'Curso' },
        { nome: 'nascimento', tipo: 'date', label: 'Data de Nascimento' }
      ];
    } else {
      this.campos = [
        { nome: 'nome', tipo: 'text', label: 'Nome' },
        { nome: 'cpf', tipo: 'text', label: 'CPF' }
      ];
    }
  }

  loadRegistros() {

    if (this.userId && this.collection) {

      const collectionPath = "users/" + this.userId + "/" + this.collection;
      console.log(collectionPath);

      // Carrega os registros da subcoleção específica do usuário
      this.firestoreService
        .getRegistros(collectionPath)
        .subscribe((registros: Registro[]) => {
          this.registros = registros;
          this.totalRegistros = this.registros.length;
          this.totalPages = Math.ceil(this.totalRegistros / this.pageSize);
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        });

      this.isLoading = false;

      if (this.registros.length === 0) {
        console.log('Nenhuma ficha encontrada.');
      } else {
        console.log('Registros carregados:', this.registros);
      }
    }
    else {
      console.error('Erro: Variáveis necessárias não foram definidas corretamente.');
    }
  }

  createForm() {
    let formGroup: any = {};
    this.campos.forEach(campo => {
      formGroup[campo.nome] = [''];
    });

    this.registroForm = this.fb.group(formGroup);
  }

  setPage(page: number) {
    this.page = page;
    this.loadRegistros();
  }

  voltar() {
    this.navegacaoService.goBack();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadRegistros();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadRegistros();
    }
  }

  verFicha(id: string) {
    console.log( 'verFicha(' + id + ')' );
    
    const fichaPath = "view/" + this.collection;
    console.log('fichaPath = ' + fichaPath);
    this.router.navigate([fichaPath, id]);
  }

  adicionar() {
    if (!this.userId) return; // Verifica se o userId está disponível

    this.firestoreService
      .gerarProximoCodigo(`users/${this.userId}/${this.collection}`)
      .then((novoCodigo) => {
        const novoRegistro: Registro = {
          id: this.firestoreService.createId(),
          codigo: novoCodigo,
          nome: '',
          sexo: '',
          cpf: '',
          telefone: '',
          nascimento: '',
        };

        // Adiciona o novo registro à subcoleção do usuário logado
        this.firestoreService
          .addRegistro(`users/${this.userId}/${this.collection}`, novoRegistro)
          .then(() => {
            this.router.navigate([`/edit/${this.collection}`, novoRegistro.id]);
          })
          .catch((error) => {
            console.error('Erro ao adicionar novo registro:', error);
            alert('Erro ao adicionar novo registro.');
          });
      });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const registroData = this.registroForm.value; // Obtém os dados do formulário

      if (this.userId && this.collection) {
        // Atualiza ou cria um novo registro na subcoleção com os dados do formulário
        const registroId = this.firestoreService.createId();
        this.firestoreService.addRegistro(`users/${this.userId}/${this.collection}`, { id: registroId, ...registroData })
          .then(() => {
            console.log('Registro salvo com sucesso:', registroData);
            alert('Registro salvo com sucesso!');
            this.loadRegistros(); // Recarrega a lista de registros
          })
          .catch(error => {
            console.error('Erro ao salvar o registro:', error);
            alert('Erro ao salvar o registro.');
          });
      }
    } else {
      alert('Formulário inválido. Por favor, verifique os campos.');
    }
  }

}
