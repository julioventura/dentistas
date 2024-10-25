import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegacaoService } from '../shared/navegacao.service';
import { FirestoreService } from '../shared/firestore.service';
import { Registro } from './registro.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilService } from '../shared/util.service';
import { CamposService } from '../shared/campos.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar o AngularFirestore

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  collection!: string;
  registros: Registro[] = [];
  totalRegistros = 0;
  page = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];
  userId: string | null = null;
  isLoading = true;
  titulo_da_pagina: string = '';
  searchQuery: string = '';
  registrosFiltrados: Registro[] = [];
  colecoes: any[] = [];
  camposIniciais: any[] = [];
  colecaoSelecionada: string = 'padrao';

  registroForm!: FormGroup;
  campos: { nome: string, tipo: string, label: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navegacaoService: NavegacaoService,
    private firestoreService: FirestoreService<Registro>,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private fb: FormBuilder,
    public util: UtilService,
    private camposService: CamposService,
    private firestore: AngularFirestore,

  ) { }

  ngOnInit() {
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    console.log("Registros de " + this.collection);

    if (this.collection) {
      this.titulo_da_pagina = 'Lista de ' + this.util.titulo_ajuste_plural(this.collection);
      this.definirCampos();
    } else {
      console.error('Erro: A coleção não foi definida corretamente.');
      this.titulo_da_pagina = 'Coleção não definida';
    }

    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        console.log("this.userId = " + user.uid);
        this.verificarOuCriarConfiguracao(); // Verifica a configuração ao carregar a página
        this.loadRegistros();
        this.createForm();

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
    console.log("loadRegistros()");

    if (this.userId && this.collection) {
      const collectionPath = `users/${this.userId}/${this.collection}`;
      this.isLoading = true;

      this.firestoreService.getRegistros(collectionPath, ref => ref.orderBy('nome')).subscribe(
        (registros: Registro[]) => {
          this.registros = registros;
          this.registrosFiltrados = registros;
          this.totalRegistros = this.registros.length;
          this.totalPages = Math.ceil(this.totalRegistros / this.pageSize);
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

          // Verifica se a lista de registros está vazia
          if (registros.length === 0) {
            console.log("Nenhum registro encontrado.");
            this.verificarOuCriarConfiguracao();
          }

          this.isLoading = false;
        },
        (error) => {
          console.error('Erro ao carregar registros:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('Erro: Variáveis necessárias não foram definidas corretamente.');
    }
  }

  

  verificarOuCriarConfiguracao() {
    if (this.userId) {
      const configPath = `users/${this.userId}/configuracoesCampos/${this.collection}`;

      // Verifica se a coleção já existe em "configuracoesCampos"
      this.firestore.collection(`users/${this.userId}/configuracoesCampos`).doc(this.collection).get()
        .subscribe((doc) => {
          if (doc.exists) {
            console.log(`Configuração já existe para a coleção "${this.collection}".`);
          } else {
            // Se a configuração não existir, cria com os campos padrão
            const camposPadrao = this.getCamposPadraoPorCollection();

            this.firestore.collection(`users/${this.userId}/configuracoesCampos`).doc(this.collection).set({ campos: camposPadrao })
              .then(() => {
                console.log(`Configuração criada para a coleção "${this.collection}".`);
                alert(`Configuração padrão criada para a coleção "${this.collection}". Você pode personalizar os campos em "Configurações".`);
              })
              .catch((error) => {
                console.error('Erro ao criar configuração de campos padrão:', error);
              });
          }
        }, (error) => {
          console.error('Erro ao verificar configuração de campos:', error);
        });
    }
  }

  getCamposPadraoPorCollection() {  
      // Campos padrão genéricos
      return [
        { nome: 'nome', tipo: 'text', label: 'Nome' },
        { nome: 'codigo', tipo: 'text', label: 'Código' },
        { nome: 'sexo', tipo: 'text', label: 'Sexo' },
        { nome: 'nascimento', tipo: 'date', label: 'Nascimento' },
        { nome: 'whatsapp', tipo: 'text', label: 'WhatsApp' },
        { nome: 'telefone', tipo: 'text', label: 'Email' },
        { nome: 'email', tipo: 'text', label: 'Telefone' },
        { nome: 'endereço', tipo: 'text', label: 'Endereço' },
        { nome: 'bairro', tipo: 'text', label: 'Bairro' },
        { nome: 'cidade', tipo: 'text', label: 'Cidade' },
        { nome: 'estado', tipo: 'text', label: 'Estado' },
        { nome: 'cep', tipo: 'text', label: 'Cep' },
        { nome: 'cpf', tipo: 'text', label: 'CPF' },
        { nome: 'obs', tipo: 'textarea', label: 'Observação' },
        { nome: 'nuvem', tipo: 'url', label: 'Arquivos' }
      ];
  }



  // setCamposRegistro(userId: string, colecao: string, campos: any[]): Promise<void> {
  //   const configPath = `users/${userId}/configuracoesCampos/${colecao}`;
  //   return this.firestore.collection(configPath).doc('campos').set({ campos });
  // }



  createForm() {
    console.log("createForm()");

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
    const fichaPath = `view/${this.collection}`;
    this.router.navigate([fichaPath, id]);
  }

  adicionar() {
    console.log("adicionar()");

    if (!this.userId) return;

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

  filtrarRegistros() {
    console.log("filtrarRegistros()");

    const query = this.searchQuery.toLowerCase();
    this.registrosFiltrados = this.registros.filter(registro => {
      const nome = registro.nome ? registro.nome.toLowerCase() : '';
      const codigo = registro.codigo ? registro.codigo.toLowerCase() : '';
      return nome.includes(query) || codigo.includes(query);
    });
  }

  onSubmit() {
    console.log("onSubmit()");

    if (this.registroForm.valid) {
      const registroData = this.registroForm.value;

      if (this.userId && this.collection) {
        const registroId = this.firestoreService.createId();
        this.firestoreService.addRegistro(`users/${this.userId}/${this.collection}`, { id: registroId, ...registroData })
          .then(() => {
            alert('Registro salvo com sucesso!');
            this.loadRegistros();
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
