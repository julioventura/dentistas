// Importa os módulos e serviços necessários para o componente
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/utils/util.service';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  // Declaração de variáveis para armazenar dados do usuário, coleção, registro, etc.
  userId: string | null = null; // Armazena o ID autenticado do usuário
  collection!: string; // Armazena o nome da coleção (por exemplo, "pacientes", "alunos", etc)
  subcollection!: string; // Armazena o nome da subcollection (ou ficha interna)
  registro: any = null; // Armazena os dados do registro carregado
  id!: string; // ID do registro principal da coleção
  view_only: boolean = true; // Indica se a visualização é somente leitura
  fichaId: string = ''; // ID da ficha interna, caso esteja visualizando uma subcollection
  titulo_da_pagina: string = ''; // Título principal da página, ajustado conforme o contexto
  subtitulo_da_pagina: string = ''; // Subtítulo da página, normalmente derivado do registro carregado
  isLoading = true; // Flag para indicar se os dados ainda estão sendo carregados
  registroPath: string = ''; // Caminho utilizado para operações com o registro (exclusão)
  routePath: string = ''; // Caminho da rota para redirecionamento após operações
  show_menu: boolean = false; // Controla a exibição de menus adicionais na visualização
  menu_exame: boolean = false; // Possível flag para exibir um menu específico para exame

  // No construtor, são injetadas as dependências necessárias: serviços, rotas, autenticação, etc.
  constructor(
    private route: ActivatedRoute, // Para acessar parâmetros da rota
    private router: Router, // Para navegação entre páginas
    private firestoreService: FirestoreService<any>, // Serviço para interações com o Firestore
    private afAuth: AngularFireAuth, // Serviço para autenticação do Firebase
    public util: UtilService, // Serviço utilitário
    public FormService: FormService // Serviço para lidar com a lógica dos formulários/carregamento dos registros
  ) { }

  // Método Angular OnInit executado na inicialização do componente
  ngOnInit() {
    console.log('ngOnInit()');

    // Subscreve o estado de autenticação do usuário
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        // Se o usuário está autenticado, define o userId
        this.userId = user.uid;

        // Obtém parâmetros da rota (id, collection, subcollection e fichaId)
        const id = this.route.snapshot.paramMap.get('id');
        if (id) { this.id = id; }
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        this.subcollection = this.route.snapshot.paramMap.get('subcollection')!;
        this.fichaId = this.route.snapshot.paramMap.get('fichaId')!;

        // Verifica se os parâmetros obrigatórios foram passados
        if (!this.collection || !this.id) {
          console.warn('Collection ou ID não foram passados corretamente.');
          return;
        }

        // Log para fins de debug dos parâmetros recebidos
        console.log("view.component.ts -> collection:", this.collection);
        console.log("view.component.ts -> id:", this.id);

        // Define o título da página com base na existência de uma subcollection (ficha interna)
        if (this.subcollection) {
          this.titulo_da_pagina = this.util.titulo_ajuste_singular(this.subcollection);
        }
        else {
          this.titulo_da_pagina = this.util.titulo_ajuste_singular(this.collection);
        }

        // Log dos valores atuais para debug
        console.log('userId:', this.userId);
        console.log('collection:', this.collection);
        console.log('id:', id);
        console.log('titulo_da_pagina:', this.titulo_da_pagina);
        console.log('subcollection:', this.subcollection);
        console.log('fichaId:', this.fichaId);

        // Caso o registro (id) não esteja identificado, redireciona para outra rota
        if (!this.id) {
          console.error('Registro não identificado.');
          this.voltar();
        }
        else {
          // Se o parâmetro subcollection estiver presente, carrega a ficha interna
          if (this.subcollection) {
            // Chama o serviço para carregar os dados da ficha interna do registro
            this.FormService.loadFicha(this.userId, this.collection, this.id, this.subcollection, this.fichaId, this.view_only);
          }
          else {
            // Caso não haja subcollection, carrega o registro da coleção
            this.FormService.loadRegistro(this.userId, this.collection, this.id, this.view_only);

            // Verifica se o registro foi carregado antes de acessar seus atributos
            if (this.FormService.registro) {
              // Exibe no console os dados do registro carregado para debug
              console.log("this.FormService.registro", this.FormService.registro);
            } else {
              // Emite um aviso caso os dados do registro ou nome não estejam disponíveis
              console.warn('********************************');
              console.warn('Registro ou nome não disponível.');
              console.warn('********************************');
            }
          }

          // Define o subtítulo da página usando o nome do registro carregado
          this.subtitulo_da_pagina = this.FormService.nome_in_collection;
          console.log('subtitulo_da_pagina:', this.subtitulo_da_pagina);

          // Mostra ou oculta o menu de ações baseado na presença de parâmetros e na rota
          if (this.collection && id && !this.subcollection) {
            this.show_menu = true;
          }
          else {
            this.show_menu = false;
          }
        }
        // Removido o setTimeout para focar no campo "Nome", pois não é necessário em view only.
      } else {
        // Caso o usuário não esteja autenticado, exibe erro e redireciona para a home
        console.error('Usuário não autenticado.');
        this.util.goHome();
      }
    });
    console.log('Formulário de visualização inicializado.');
  }

  
  // Função para redirecionar para a edição do registro ou ficha interna
    editar() {
    console.log('editar()');

    // Se estiver visualizando uma ficha interna (subcollection)
    if (this.subcollection) {
      const editPath = `/edit-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens`;
      console.log("editPath =", editPath);
      console.log("fichaId =", this.fichaId);
      // Redireciona para a rota de edição da ficha interna
      this.router.navigate([editPath, this.fichaId]);
    }
    else {
      // Se estiver visualizando apenas o registro da coleção, redireciona para a rota de edição deste registro
      const editPath = `/edit/${this.collection}`;
      console.log("editPath =", editPath);
      console.log("id =", this.id);
      this.router.navigate([editPath, this.id]);
    }
  }

  // Função para excluir o registro ou a ficha interna
  excluir() {
    console.log("excluir()");

    // Confirmação antes de executar a exclusão
    if (confirm('Você tem certeza que deseja excluir este registro?')) {

      let registro_id = '';

      // Se for uma ficha interna (subcollection), define os caminhos e ID corretos
      if (this.subcollection) {
        this.registroPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subcollection}/itens`;
        this.routePath = `/list-fichas/${this.collection}/${this.id}/fichas/${this.subcollection}`;
        registro_id = this.fichaId;
      }
      else {
        // Para a exclusão do registro principal da collection
        this.registroPath = `users/${this.userId}/${this.collection}`;
        this.routePath = `list/${this.collection}`;
        registro_id = this.id;
      }

      // Chama o serviço para excluir o registro ou ficha
      this.firestoreService.deleteRegistro(this.registroPath, registro_id)
        .then(() => {
          // Emite um alert e redireciona após a exclusão bem-sucedida
          alert('Registro excluido.');
          this.router.navigate([this.routePath]);
        })
        .catch((error) => {
          // Loga um erro caso a exclusão falhe
          console.error('Erro ao excluir o registro:', error);
        });
    }
  }

  // Função que retorna os campos dinâmicos que não estão pré-definidos no serviço
  getDynamicFields(): string[] {
    // Mapeia os nomes dos campos já definidos em FormService.campos
    const predefinedFields = this.FormService.campos.map(campo => campo.nome);
    // Retorna os nomes dos controles do formulário que não estão na lista de campos pré-definidos
    return Object.keys(this.FormService.fichaForm.controls).filter(
      campoNome => !predefinedFields.includes(campoNome)
    );
  }
  
  // Função para voltar à lista de registros ou fichas internas
  voltar() {
    console.log("voltar()");
    console.log("subcollection =", this.subcollection);

    // Se existir subcollection, monta o caminho para as fichas internas; caso contrário, para a lista da collection
    const listaPath = this.subcollection ?
      `/list-fichas/${this.collection}/${this.id}/fichas/${this.subcollection}` :
      `list/${this.collection}`;

    // Navega para a rota definida
    this.router.navigate([listaPath]);
  }
}

