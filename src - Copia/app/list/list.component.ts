import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegacaoService } from '../shared/navegacao.service';
import { FirestoreService } from '../shared/firestore.service';
import { Registro } from './registro.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilService } from '../shared/util.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar o AngularFirestore

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  collection!: string;
  registros: Registro[] = [];
  registrosFiltrados: Registro[] = [];
  totalRegistros = 0;
  page = 1;
  pageSize = 10;
  totalPages = 0;
  userId: string | null = null;
  isLoading = true;
  titulo_da_pagina: string = '';
  searchQuery: string = '';

  registroForm!: FormGroup;
  campos: { nome: string, tipo: string, label: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navegacaoService: NavegacaoService,
    private firestoreService: FirestoreService<Registro>,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    public util: UtilService,
    private firestore: AngularFirestore,

  ) { }

  ngOnInit() {
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    console.log("Registros de " + this.collection);

    if (this.collection) {
      this.titulo_da_pagina = 'Lista de ' + this.util.titulo_ajuste_plural(this.collection);
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

  loadRegistros() {
    console.log("loadRegistros()");

    if (this.userId && this.collection) {
      const collectionPath = `users/${this.userId}/${this.collection}`;
      this.isLoading = true;

      this.firestoreService.getRegistros(collectionPath, ref => ref.orderBy('nome')).subscribe(
        (registros: Registro[]) => {
          this.registros = registros;
          this.registrosFiltrados = this.applyPagination(registros);
          this.totalRegistros = registros.length;
          this.totalPages = Math.ceil(this.totalRegistros / this.pageSize);

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

  // Aplica a paginação nos registros
  applyPagination(registros: Registro[]): Registro[] {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return registros.slice(startIndex, endIndex);
  }

  verificarOuCriarConfiguracao() {
    if (this.userId) {
      const configPath = `users/${this.userId}/configuracoesCampos/${this.collection}`;

      this.firestore.collection(`users/${this.userId}/configuracoesCampos`).doc(this.collection).get()
        .subscribe((doc) => {
          if (doc.exists) {
            console.log(`Configuração já existe para a coleção "${this.collection}".`);
          } else {
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

  createForm() {
    let formGroup: any = {};
    this.campos.forEach(campo => {
      formGroup[campo.nome] = [''];
    });
    this.registroForm = this.fb.group(formGroup);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.registrosFiltrados = this.applyPagination(this.registros);
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.setPage(this.page - 1);
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.setPage(this.page + 1);
    }
  }

  verFicha(id: string) {
    const fichaPath = `view/${this.collection}`;
    this.router.navigate([fichaPath, id]);
  }

  adicionar() {
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
    const query = this.searchQuery.toLowerCase();
    this.registrosFiltrados = this.registros.filter(registro => {
      const nome = registro.nome ? registro.nome.toLowerCase() : '';
      const codigo = registro.codigo ? registro.codigo.toLowerCase() : '';
      return nome.includes(query) || codigo.includes(query);
    });
    this.registrosFiltrados = this.applyPagination(this.registrosFiltrados);
  }

  onSubmit() {
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
