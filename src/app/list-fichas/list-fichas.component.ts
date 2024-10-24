import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilService } from '../shared/util.service';
import { FormService } from '../shared/form.service';
import { CamposFichaService } from '../shared/campos-ficha.service';

@Component({
  selector: 'app-list-fichas',
  templateUrl: './list-fichas.component.html',
  styleUrl: './list-fichas.component.scss'
})
export class ListFichasComponent implements OnInit {
  collection!: string;
  subCollection!: string; // Sub-coleção (exames, etc.)
  id!: string;
  id_nome_collected: string = '';
  fichas: any[] = []; // Lista de fichas (exames, atendimentos, etc.)
  userId: string | null = null;
  isLoading = true;   // Indicador de carregamento  
  titulo_da_pagina: string = '';
  subtitulo_da_pagina: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    public util: UtilService,
    public FormService: FormService,
    public CamposFichaService: CamposFichaService,

  ) { }

  ngOnInit(): void {
    console.log('ngOnInit()');

    this.afAuth.authState.subscribe((user) => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.subCollection = this.route.snapshot.paramMap.get('subcollection')!;

        this.loadAllFichas();
      }
    });

    this.id = this.route.snapshot.paramMap.get('id')!;
  }


  loadAllFichas() {
    console.log('loadAllFichas()');

    console.log('Collection:', this.collection);
    console.log('ID:', this.id);
    console.log('subCollection:', this.subCollection);

    this.titulo_da_pagina = "Fichas de " + this.util.capitalizar(this.subCollection);
    this.subtitulo_da_pagina = this.FormService.id_nome_collected;

    if (this.subCollection && this.userId && this.collection && this.id) {
      const fichasPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;
      console.log('Caminho para subcoleção (listagem de fichas):', fichasPath);

      this.firestore.collection(fichasPath)
        .snapshotChanges()
        .subscribe(actions => {
          this.fichas = actions.map(action => {
            const data = action.payload.doc.data() as { [key: string]: any };
            const fichaId = action.payload.doc.id;  // Usa o fichaId diretamente do caminho do Firestore

            // Retorna o fichaId do Firestore e ignora qualquer campo `id` no documento
            return { fichaId, ...data };  // Retorna o fichaId sempre e somente ele
          });
          this.isLoading = false;

          if (this.fichas.length === 0) {
            console.log('Nenhuma ficha encontrada.');
          } else {
            console.log('Fichas carregadas:', this.fichas);
          }
        }, error => {
          console.error('Erro ao carregar fichas:', error);
          this.isLoading = false;
        });
    }
    else {
      console.error('Erro: Variáveis necessárias não foram definidas corretamente.');
    }
  }

  incluir(): void {
    console.log('incluir()');

    if (!this.userId) {
      console.error('Usuário não autenticado.');
      return; // Verifica se o userId está disponível
    }

    const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;
    console.log('Caminho para nova ficha:', fichaPath);

    // Verifica se existe configuração personalizada de campos para a sub-coleção
    this.CamposFichaService.getCamposRegistro(this.userId,this.subCollection).subscribe((camposConfigurados) => {
      let campos = camposConfigurados || this.CamposFichaService.camposPadrao;

      // Gera o novo registro com campos em branco
      const novoRegistro: any = {};
      campos.forEach(campo => {
        novoRegistro[campo.nome] = '';  // Inicializa os campos com valores em branco
      });

      // Adiciona o campo 'id' obrigatório e um campo 'data' automático
      novoRegistro.id = this.firestore.createId();
      novoRegistro.data = new Date().toISOString().split('T')[0];
      novoRegistro.createdOn = new Date().toISOString(); // Formato ISO de data e hora

      console.log('Novo registro gerado:', novoRegistro);

      // Adiciona o novo registro ao Firestore
      this.firestore.collection(fichaPath).doc(novoRegistro.id).set(novoRegistro).then(() => {
        console.log('Nova ficha criada com sucesso:', novoRegistro.id);
        // Redireciona para a página de edição da nova ficha criada
        this.router.navigate([`/edit-ficha/${this.collection}/${this.id}/ficha/${this.subCollection}/itens/${novoRegistro.id}`]);
      }).catch((error) => {
        console.error('Erro ao adicionar nova ficha:', error);
        alert('Erro ao criar nova ficha.');
      });
    });
  }


  verFicha(fichaId: string) {
    console.log('verFicha(' + fichaId + ')');
    console.log("fichaId = '" + fichaId + "'");

    // Utiliza sempre o fichaId do Firestore
    if (fichaId && fichaId.trim() !== '') {
      const fichaPath = `/view-ficha/${this.collection}/${this.id}/ficha/${this.subCollection}/itens/${fichaId}`;
      console.log('Navegando para ficha:', fichaPath);
      this.router.navigate([fichaPath]);
    } else {
      this.exibirAlertaIdInvalido("fichaId é inválido: '" + fichaId + "'");
    }
  }

  exibirAlertaIdInvalido(mensagem: string) {
    // Exibe um alerta e, após confirmação, redireciona o usuário para a listagem
    alert(mensagem);
    this.voltarParaListagem();
  }

  voltarParaListagem() {
    // Função para redirecionar o usuário de volta para a página de listagem
    console.log('Redirecionando para a listagem...');
    this.router.navigate(['/listagem']); // Substitua 'listagem' pela rota correta da sua aplicação
  }

  voltar(): void {
    this.router.navigate([`/view/${this.collection}/${this.id}`]);
  }
}
