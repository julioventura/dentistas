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
  registrosPaginados: Registro[] = [];
  totalRegistros = 0;
  filteredTotal = 0;
  page = 1;
  pageSize = 10;
  totalPages = 0;
  userId: string | null = null;
  isLoading = true;
  titulo_da_pagina: string = '';
  searchQuery: string = '';
  registroForm!: FormGroup;
  campos: { nome: string, tipo: string, label: string }[] = [];

  pages: number[] = []; // Armazena a lista de páginas

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
    console.log("ngOnInit()");

    this.collection = this.route.snapshot.paramMap.get('collection')!;
    console.log("Registros de " + this.collection);
    this.titulo_da_pagina = this.collection ? 'Lista de ' + this.util.titulo_ajuste_plural(this.collection) : 'Coleção não definida';

    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        console.log("this.userId = " + user.uid);
        this.verificarOuCriarConfiguracao(); // Verifica a configuração ao carregar a página
        this.createForm();
        this.loadRegistros();
      }
    });
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

  getCamposPadraoPorCollection() {
    console.log("getCamposPadraoPorCollection()");

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
    console.log("createForm()");

    let formGroup: any = {};
    this.campos.forEach(campo => {
      formGroup[campo.nome] = [''];
    });
    this.registroForm = this.fb.group(formGroup);
  }

 
 

  verFicha(id: string) {
    console.log("verFicha()");

    const fichaPath = `view/${this.collection}`;
    this.router.navigate([fichaPath, id]);
  }

  incluir() {
    console.log("incluir()");

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
            console.error('Erro ao incluir novo registro:', error);
            alert('Erro ao incluir novo registro.');
          });
      });
  }



  loadRegistros() {
    if (this.userId && this.collection) {
      const collectionPath = `users/${this.userId}/${this.collection}`;
      this.isLoading = true;

      this.firestoreService.getRegistros(collectionPath, ref => ref.orderBy('nome')).subscribe(
        (registros: Registro[]) => {
          this.registros = registros;
          this.totalRegistros = this.registros.length;
          this.page = 1;
          this.searchQuery = '';
          this.registrosFiltrados = [...this.registros];

          // Log para total de registros carregados
          console.log('Total registros:', this.registros);

          this.atualizarPaginacao(); // Atualiza totalPages e paginados
          this.isLoading = false;

          // Log para verificar registros paginados na página atual
          console.log(`registrosPaginados ${this.page}:`, this.registrosPaginados);
          console.log(`registrosFiltrados ${this.page}:`, this.registrosFiltrados);
          console.log(`registros ${this.page}:`, this.registros);
        },
        (error) => {
          console.error('Erro ao carregar registros:', error);
          this.isLoading = false;
        }
      );
    }
  }




  filtrarRegistros() {
    const query = this.searchQuery.toLowerCase();

    // Log para verificar registros paginados na página atual
    console.log(`registrosPaginados ${this.page}:`, this.registrosPaginados);
    console.log(`registrosFiltrados ${this.page}:`, this.registrosFiltrados);
    console.log(`registros ${this.page}:`, this.registros);

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
    console.log('Registros após filtro:', this.registrosFiltrados);
    this.atualizarPaginacao();
  }


  atualizarPaginacao() {
    this.filteredTotal = this.registrosFiltrados.length;
    this.totalPages = Math.ceil(this.filteredTotal / this.pageSize);
    this.atualizarRegistrosPaginados();
    // Log para verificar registros paginados na página atual
    console.log(`registrosPaginados ${this.page}:`, this.registrosPaginados);
    console.log(`registrosFiltrados ${this.page}:`, this.registrosFiltrados);
    console.log(`registros ${this.page}:`, this.registros);
  }


  atualizarRegistrosPaginados() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.registrosPaginados = this.registrosFiltrados.slice(startIndex, endIndex);
    // Log para verificar registros paginados na página atual
    console.log(`registrosPaginados ${this.page}:`, this.registrosPaginados);
    console.log(`registrosFiltrados ${this.page}:`, this.registrosFiltrados);
    console.log(`registros ${this.page}:`, this.registros);
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
