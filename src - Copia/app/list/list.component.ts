/* 
  Métodos do componente ListComponent:
  1. ngOnInit() - Inicializa o componente, obtendo parâmetros de rota, autenticando o usuário e chamando as funções de configuração e carregamento dos registros.
  2. loadRegistros() - Constrói o caminho da coleção e consulta o Firestore para recuperar os registros, além de inicializar a paginação.
  3. verFicha(fichaId: string) - Monta o caminho para a visualização do registro (ou ficha interna) e realiza a navegação.
  4. incluir() - Cria dinamicamente um novo registro, gerando seu ID e código, e inicializando seus campos conforme a configuração personalizada.
  5. filtrarRegistros() - Filtra os registros com base na query de busca (nome ou código) e atualiza a paginação.
  6. atualizarPaginacao() - Recalcula o total de páginas e atualiza os registros exibidos na página atual.
  7. atualizarRegistrosPaginados() - Determina o slice dos registros que serão exibidos conforme a página atual.
  8. setPage(page: number) - Define a página atual e atualiza os registros paginados.
  9. previousPage() - Retrocede para a página anterior se possível.
  10. nextPage() - Avança para a próxima página se houver.
  11. verificarOuCriarConfiguracao() - Verifica se já existe uma configuração de campos para a coleção e cria uma padrão se necessário.
  12. getMenusPadraoPorCollection(colecao: string) - Retorna os menus padrão para a coleção informada.
  13. getCamposPadraoPorCollection() - Retorna os campos padrão (objetos) para a coleção.
  14. showbusca() - Alterna a exibição da barra de pesquisa.
  15. voltar() - Navega de volta à lista de registros ou fichas internas.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { Registro } from './registro.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilService } from '../shared/utils/util.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar o AngularFirestore
import { FormService } from '../shared/form.service';
import { ExportService } from '../shared/export.service';
import { PdfExportService } from '../shared/pdf-export.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  // Propriedades do componente
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
  userEmail: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<Registro>,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    public util: UtilService,
    private firestore: AngularFirestore,
    public FormService: FormService,
    private exportService: ExportService,
    private pdfExportService: PdfExportService
  ) { }

  /**
   * ngOnInit() - (a) Ação automática (hook do Angular)
   * Executado quando o componente é inicializado.
   * Responsável por obter parâmetros de rota, definir títulos e carregar registros.
   */
  ngOnInit() {
    console.log("ngOnInit()");

    this.collection = this.route.snapshot.paramMap.get('collection')!;
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.subcollection = this.route.snapshot.paramMap.get('subcollection')!;

    // Define os títulos conforme se há subcollection ou não
    this.titulo_da_pagina = this.subcollection ? this.util.titulo_ajuste_plural(this.subcollection) : this.util.titulo_ajuste_plural(this.collection);
    this.subtitulo_da_pagina = this.subcollection ? this.FormService.nome_in_collection : '';

    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.userEmail = user.email;
        // Chamada interna para verificar configuração de campos (d)
        this.verificarOuCriarConfiguracao();
        // Chamada interna para carregar registros (d)
        this.loadRegistros();
      }
    });

    this.registroForm = this.fb.group({
      nome: [''],
      id: ['']
    });
  }

  /**
   * loadRegistros() - (d) Chamada apenas internamente no componente.
   * Responsável por construir o caminho da coleção e consultar o Firestore
   * para recuperar e armazenar os registros, bem como inicializar a paginação.
   */
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

      // Consulta os registros ordenados pelo campo "nome"
      this.firestoreService.getRegistros(collectionPath, ref => ref.orderBy('nome')).subscribe(
        (registros: Registro[]) => {
          this.registros = registros;
          this.totalRegistros = this.registros.length;
          this.page = 1;
          this.searchQuery = '';
          // Inicializa a listagem filtrada e atualiza a paginação
          this.registrosFiltrados = [...this.registros];
          this.atualizarPaginacao();
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

  /**
   * verFicha(fichaId: string) - (b) É chamada a partir do template (por clique, por exemplo)
   * Responsável por montar o caminho para a visualização do registro ou ficha e realizar a navegação.
   */
  verFicha(fichaId: string) {
    console.log("verFicha(fichaId)");
    const fichaPath = this.subcollection ?
      `/view-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens` :
      `view/${this.collection}`;
    console.log("fichaPath =", fichaPath);
    console.log("fichaId =", fichaId);
    this.router.navigate([fichaPath, fichaId]);
  }

  /**
   * incluir() - (b) Invocada a partir do template (ex: clique em "Novo")
   * Cria dinamicamente um novo registro, gerando seu ID e código, e inicializando
   * seus campos com base na configuração personalizada definida pelo usuário.
   *
   * Essa abordagem evita a inicialização fixa do objeto Registro e reflete as personalizações
   * realizadas no componente CamposRegistro, permitindo que campos customizados sejam
   * considerados automaticamente na criação do objeto.
   */
  incluir() {
    console.log("incluir()");
    if (this.userId) {

      const collectionPath = this.subcollection ?
        `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subcollection}/itens` :
        `users/${this.userId}/${this.collection}`;
      console.log("collectionPath " + collectionPath);

      const collectionRoute = this.subcollection ?
        `/edit-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens` :
        `/edit/${this.collection}`;
      console.log("collectionRoute ", collectionRoute);

      this.firestoreService.gerarProximoCodigo(collectionPath).then((novoCodigo) => {
        // Criação dinâmica do objeto novoRegistro:
        // - Gera um id único e atribui o código gerado.
        // - Itera sobre os campos personalizados configurados (por ex.: via CamposRegistro)
        //   para inicializar, dinamicamente, cada campo com valor padrão (neste caso, uma string vazia).
        const novoRegistro: any = {};
        novoRegistro.id = this.firestoreService.createId();
        novoRegistro.codigo = novoCodigo;
    
        if (this.userId && this.subcollection) {
          // O registro está em uma subcollection

          this.FormService.carregarCamposFichas(this.userId, this.subcollection);
          
          novoRegistro.ficha_id = this.id;
          this.FormService.campos.forEach(campo => {
            novoRegistro[campo.nome] = '';
          });

          // Gera a data atual no formato dd/mm/yyyy e inicializa o campo data do novo registro de subcollection
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();
          // Ajusta o formato de data para "yyyy-MM-dd" por ser um campo 'date'no formulario
          novoRegistro['data'] = `${year}-${month}-${day}`;
        }
        else {
          // O registro está em uma collection
          this.FormService.campos.forEach(campo => {
            novoRegistro[campo.nome] = '';
          });
        }

        // Fim da inicialização dinâmica do registro que reflete a personalização de campos

        this.firestoreService.addRegistro(collectionPath, novoRegistro).then(() => {
          console.log("Criou registro " + novoRegistro.id);
          this.router.navigate([collectionRoute, novoRegistro.id]);
        })
        .catch((error) => {
          console.error('Erro ao incluir novo registro:', error);
          alert('Erro ao incluir novo registro.');
        });
      });
    }
  }

  /**
   * filtrarRegistros() - (b) É chamada a partir do template (por exemplo, no evento input da barra de busca)
   * Filtra o array de registros com base na query de busca (nome ou código) e atualiza a paginação.
   */
  filtrarRegistros() {
    const query = this.searchQuery.toLowerCase();
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
    this.atualizarPaginacao();
  }

  /**
   * atualizarPaginacao() - (d) Chamada internamente para atualizar a paginação.
   * Recalcula o total de páginas e chama atualizarRegistrosPaginados() para definir o slice de registros da página atual.
   */
  atualizarPaginacao() {
    this.filteredTotal = this.registrosFiltrados.length;
    this.totalPages = Math.ceil(this.filteredTotal / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.atualizarRegistrosPaginados();
  }

  /**
   * atualizarRegistrosPaginados() - (d) Chamada internamente para atualizar os registros exibidos na página atual.
   * Calcula o índice de início e fim com base na página atual e no tamanho da página, e atualiza o array de registros paginados.
   */
  atualizarRegistrosPaginados() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.registrosPaginados = this.registrosFiltrados.slice(startIndex, endIndex);
  }

  /**
   * setPage(page: number) - (b) Geralmente chamada a partir do template (por controle de paginação)
   * Ajusta a página atual para o número informado e atualiza os registros exibidos.
   */
  setPage(page: number) {
    this.page = page;
    this.atualizarRegistrosPaginados();
  }

  /**
   * previousPage() - (b) Chamada a partir do template (por exemplo, botão "Página Anterior")
   * Decrementa a página atual se não for a primeira e atualiza os registros paginados.
   */
  previousPage() {
    console.log("previousPage()");
    if (this.page > 1) {
      this.page--;
      this.atualizarRegistrosPaginados();
    }
  }

  /**
   * nextPage() - (b) Chamada a partir do template (por exemplo, botão "Próxima Página")
   * Incrementa a página atual se houver páginas posteriores e atualiza os registros paginados.
   */
  nextPage() {
    console.log("nextPage()");
    if (this.page < this.totalPages) {
      this.page++;
      this.atualizarRegistrosPaginados();
    }
  }

  /**
   * verificarOuCriarConfiguracao() - (d) Chamada internamente (por ngOnInit) para garantir configurações de campos.
   * Verifica se existe uma configuração de campos para a coleção do usuário e, se não existir, cria uma padrão.
   */
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

  // A função verificarOuCriarMenus() está comentada e não é utilizada atualmente no codebase.
  // Ela seria classificada como (c) não usada, conforme a análise prévia.
  /*
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
  */

  /**
   * getMenusPadraoPorCollection(colecao: string) - (d) Chamada internamente (por verificarOuCriarMenus, se fosse usado)
   * Retorna um array com os menus padrão para a coleção informada.
   */
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

  /**
   * getCamposPadraoPorCollection() - (d) Chamada apenas internamente (por verificarOuCriarConfiguracao)
   * Retorna um array de objetos definindo os campos padrão para a coleção de registros.
   */
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
      { nome: 'nuvem', tipo: 'url', label: 'Arquivos' },
      { nome: 'mae', tipo: 'text', label: 'Nome da mãe' },
      { nome: 'sus', tipo: 'text', label: 'CNS/SUS' },
      { nome: 'operador', tipo: 'text', label: 'Operador' },
      { nome: 'raca', tipo: 'text', label: 'Raça ou cor' },
      { nome: 'datainicio', tipo: 'date', label: 'Data início' },
      { nome: 'dataalta', tipo: 'date', label: 'Data de alta' }
    ];
  }

  /**
   * showbusca() - (b) Chamado a partir do template (por exemplo, ao clicar num botão para alternar a busca)
   * Inverte o estado booleano que controla a exibição da barra de pesquisa.
   */
  showbusca() {
    this.show_busca = !this.show_busca;
  }

  /**
   * voltar() - (b) Chamado a partir do template (por exemplo, ao clicar num botão "voltar")
   * Navega para a rota determinada, conforme se há subcoleção ou não.
   */
  voltar() {
    console.log("voltar()");
    console.log("subcollection =", this.subcollection);
    const listaPath = this.subcollection ?
      `/view/${this.collection}/${this.id}` :
      `home`;
    this.router.navigate([listaPath]);
  }

  /**
   * exportAsCSV() - (b) Chamado a partir do template (por exemplo, botão "Exportar CSV")
   * Converte os registros (filtrados ou todos) para CSV e inicia o download.
   */
  // exportAsCSV() {
  //   const csvData = this.exportService.convertToCSV(
  //     this.registrosFiltrados.length ? this.registrosFiltrados : this.registros
  //   );
  //   this.exportService.downloadCSV('registros.csv', csvData);
  // }

  /**
   * exportAsPDF() - (b) Chamado a partir do template (por exemplo, botão "Exportar PDF")
   * Seleciona os registros (filtrados ou todos) e aciona a exportação para PDF.
   */
  // exportAsPDF() {
  //   const dataToExport = this.registrosFiltrados.length ? this.registrosFiltrados : this.registros;
  //   this.pdfExportService.exportDataAsPDF(dataToExport, 'Registros');
  // }
}
