import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { Registro } from './registro.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilService } from '../shared/utils/util.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar o AngularFirestore
import { FormService } from '../shared/form.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  collection!: string;
  subcollection?: string;
  registros: Registro[] = [];
  registrosFiltrados: Registro[] = [];
  totalRegistros = 0;
  page = 1;
  pages: number[] = [];
  pageSize = 10;
  totalPages = 0;
  userId: string | null = null;
  isLoading = true;
  searchQuery: string = '';
  filteredTotal = 0;
  registroForm!: FormGroup;
  campos: { nome: string, tipo: string, label: string }[] = [];
  registrosPaginados: Registro[] = [];
  usandoSubColecao: boolean = false;
  titulo_da_pagina: string = '';
  subtitulo_da_pagina: string = '';
  id!: string;
  nome_in_collection: string = '';
  fichas: any[] = []; // Lista de fichas (exames, atendimentos, etc.)
  show_busca: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<Registro>,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    public util: UtilService,
    private firestore: AngularFirestore,
    public FormService: FormService,

  ) { }

  ngOnInit() {
    console.log("ngOnInit()");

    this.collection = this.route.snapshot.paramMap.get('collection')!;
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.subcollection = this.route.snapshot.paramMap.get('subcollection')!;

    this.titulo_da_pagina = this.subcollection ? this.util.titulo_ajuste_plural(this.subcollection) : this.util.titulo_ajuste_plural(this.collection);
    this.subtitulo_da_pagina = this.subcollection ? this.FormService.nome_in_collection : '';

    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        // console.log("this.userId = " + user.uid);


        // Verifica se tem a configuração de campos personalizada, ao carregar a página
        this.verificarOuCriarConfiguracao();
        // this.createForm();


        // Carrega a lista de registros
        this.loadRegistros();
      }
    });
  }


  loadRegistros() {
    console.log('loadRegistros()');

    console.log('Collection:', this.collection);
    console.log('ID:', this.id);
    console.log('subcollection:', this.subcollection);

    if (this.userId && this.collection) {
      const collectionPath = this.id
        ? `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subcollection}/itens`
        : `users/${this.userId}/${this.collection}`;
      this.isLoading = true;

      // Obtenção dos registros ordenados
      this.firestoreService.getRegistros(collectionPath, ref => ref.orderBy('nome')).subscribe(
        (registros: Registro[]) => {
          this.registros = registros; // Registros completos
          this.totalRegistros = this.registros.length;
          this.page = 1; // Reseta para a primeira página
          this.searchQuery = ''; // Limpa a barra de pesquisa

          // Inicializa registrosFiltrados com todos os registros
          this.registrosFiltrados = [...this.registros];
          this.atualizarPaginacao(); // Atualiza totalPages e registrosPaginados
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


  verFicha(fichaId: string) {
    console.log("verFicha(fichaId)");

    const fichaPath = this.subcollection ?
      `/view-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens` :
      `view/${this.collection}`;

    console.log("fichaPath =", fichaPath);
    console.log("fichaId =", fichaId);

    this.router.navigate([fichaPath, fichaId]);

  }



  incluir() {
    console.log("incluir()");

    if (!this.userId) return;

    const collectionPath = this.subcollection ?
      `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subcollection}/itens` :
      `users/${this.userId}/${this.collection}`;
    console.log("collectionPath " + collectionPath);

    const collectionRoute = this.subcollection ?
      `/edit-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens` :
      `/edit/${this.collection}`;
    console.log("collectionRoute ", collectionRoute);

    this.firestoreService.gerarProximoCodigo(collectionPath).then((novoCodigo) => {
      const novoRegistro: Registro = {
        id: this.firestoreService.createId(),
        codigo: novoCodigo,
        nome: '',
        sexo: '',
        nascimento: '',
        whatsapp: '',
        telefone: '',
        email: '',
        endereço: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        cpf: '',
        obs: '',
        nuvem: '',
        data: ''
      };

      this.firestoreService.addRegistro(collectionPath, novoRegistro).then(() => {
        console.log("Criou registro " + novoRegistro.id);
        console.log("collectionRoute " + collectionRoute);
        console.log("collectionPath " + collectionPath);


        this.router.navigate([collectionRoute, novoRegistro.id]);
      })
        .catch((error) => {
          console.error('Erro ao incluir novo registro:', error);
          alert('Erro ao incluir novo registro.');
        });
    });


  }


  filtrarRegistros() {
    const query = this.searchQuery.toLowerCase();

    // // Log para verificar registros paginados na página atual
    // console.log(`registrosPaginados ${this.page}:`, this.registrosPaginados);
    // console.log(`registrosFiltrados ${this.page}:`, this.registrosFiltrados);
    // console.log(`registros ${this.page}:`, this.registros);

    if (query) {
      this.registrosFiltrados = this.registros.filter(registro => {
        const nome = registro.nome ? registro.nome.toLowerCase() : '';
        const codigo = registro.codigo ? registro.codigo.toLowerCase() : '';
        return nome.includes(query) || codigo.includes(query);
      });
    } else {
      this.registrosFiltrados = [...this.registros];
      this.page = 1;
    }
    // Log para verificar registros filtrados
    // console.log('Registros após filtro:', this.registrosFiltrados);
    this.atualizarPaginacao();
  }

  atualizarPaginacao() {
    this.filteredTotal = this.registrosFiltrados.length;
    this.totalPages = Math.ceil(this.filteredTotal / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.atualizarRegistrosPaginados();

    // Log para verificar registros paginados na página atual
    // console.log(`registrosPaginados ${this.page}:`, this.registrosPaginados);
    // console.log(`registrosFiltrados ${this.page}:`, this.registrosFiltrados);
    // console.log(`pages:`, this.pages);
    // console.log(`registros ${this.page}:`, this.registros);
  }

  atualizarRegistrosPaginados() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.registrosPaginados = this.registrosFiltrados.slice(startIndex, endIndex);

    // Log para verificar registros paginados na página atual
    // console.log(`registrosPaginados ${this.page}:`, this.registrosPaginados);
    // console.log(`registrosFiltrados ${this.page}:`, this.registrosFiltrados);
    // console.log(`registros ${this.page}:`, this.registros);
  }

  setPage(page: number) {
    this.page = page;
    this.atualizarRegistrosPaginados();
  }

  previousPage() {
    console.log("previousPage()");
    if (this.page > 1) {
      this.page--;
      this.atualizarRegistrosPaginados();
    }
  }

  nextPage() {
    console.log("nextPage()");
    if (this.page < this.totalPages) {
      this.page++;
      this.atualizarRegistrosPaginados();
    }
  }

  verificarOuCriarConfiguracao() {
    console.log("verificarOuCriarConfiguracao()");

    if (this.userId) {
      const configPath = `users/${this.userId}/configuracoesCampos`;

      this.firestore.collection(configPath).doc(this.collection).get()
        .subscribe((doc) => {
          if (doc.exists) {
            console.log(`Configuração já existe para a coleção "${this.collection}".`);
          } else {
            const camposPadrao = this.getCamposPadraoPorCollection();

            this.firestore.collection(configPath).doc(this.collection).set({ campos: camposPadrao })
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


  verificarOuCriarMenus() {
    console.log("verificarOuCriarMenus()");

    if (this.userId) {
      const configPath = `users/${this.userId}/configuracoesMenus`;
      const colecoes = [
        'pacientes',
        'clientes',
        'alunos',
        'professores',
        'dentistas',
        'equipe',
        'proteticos'
      ];

      colecoes.forEach((colecao) => {
        this.firestore.collection(configPath).doc(colecao).get()
          .subscribe((doc) => {
            if (doc.exists) {
              console.log(`Configuração de menu já existe para a coleção "${colecao}".`);
            } else {
              const menuPadrao = this.getMenusPadraoPorCollection(colecao);

              this.firestore.collection(configPath).doc(colecao).set({ menus: menuPadrao })
                .then(() => {
                  console.log(`Configuração de menu criada para a coleção "${colecao}".`);
                  alert(`Configuração de menu padrão criada para a coleção "${colecao}". Você pode personalizar os menus em "Configurações".`);
                })
                .catch((error) => {
                  console.error('Erro ao criar configuração de menu padrão:', error);
                });
            }
          }, (error) => {
            console.error('Erro ao verificar configuração de menu:', error);
          });
      });
    } else {
      console.warn("User ID não definido. Não é possível verificar ou criar configurações de menu.");
    }
  }


  getMenusPadraoPorCollection(colecao: string): any {
    const menusPadrao: { [key: string]: any[] } = {
      pacientes: ['exames', 'planos', 'atendimentos', 'pagamentos', 'historico'],
      clientes: ['planos', 'atendimentos', 'pagamentos', 'historico'],
      alunos: ['planos', 'atendimentos', 'historico'],
      professores: ['planos', 'atendimentos', 'historico'],
      dentistas: ['planos', 'atendimentos', 'pagamentos', 'historico'],
      equipe: ['planos', 'atendimentos', 'pagamentos', 'historico'],
      proteticos: ['planos', 'atendimentos', 'pagamentos', 'historico']
    };

    return menusPadrao[colecao] || [];
  }



  getCamposPadraoPorCollection() {
    console.log("getCamposPadraoPorCollection()");

    return [
      { nome: 'nome', tipo: 'text', label: 'Nome' },
      { nome: 'codigo', tipo: 'text', label: 'Código' },
      { nome: 'sexo', tipo: 'text', label: 'Sexo' },
      { nome: 'nascimento', tipo: 'date', label: 'Nascimento' },
      { nome: 'whatsapp', tipo: 'text', label: 'WhatsApp' },
      { nome: 'telefone', tipo: 'text', label: 'Telefone' },
      { nome: 'email', tipo: 'text', label: 'Email' },
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

  
  showbusca() {
    this.show_busca = !this.show_busca;
  }

  voltar() {
    console.log("voltar()");
    console.log("subcollection =", this.subcollection);

    const listaPath = this.subcollection ?
      `/view/${this.collection}/${this.id}` :
      `home`;

    this.router.navigate([listaPath]);
  }


}
