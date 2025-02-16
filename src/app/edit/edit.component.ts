import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/utils/util.service';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('nomeInput') nomeInput?: ElementRef;

  userId: string | null = null;
  collection!: string;
  subcollection!: string;
  registro: any = {};
  id!: string;
  view_only: boolean = false;
  fichaId: string = '';
  titulo_da_pagina: string = '';
  subtitulo_da_pagina: string = '';
  isLoading = true;
  registroPath: string = '';
  routePath: string = '';
  arquivos: { [key: string]: File } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private afAuth: AngularFireAuth,
    public util: UtilService,
    public FormService: FormService,
  ) { }

  /**
   * Método Angular OnInit (a)
   * - Ação automática (pelo framework).
   * - Executado ao criar o componente. 
   *   Checa autenticação do usuário, carrega dados do registro e ajusta foco no campo "Nome".
   */
  ngOnInit() {
    console.log('ngOnInit()');

    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) { this.id = id; }
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        this.subcollection = this.route.snapshot.paramMap.get('subcollection')!;
        this.fichaId = this.route.snapshot.paramMap.get('fichaId')!;

        this.titulo_da_pagina = this.util.titulo_ajuste_singular(this.subcollection || this.collection);

        console.log('userId:', this.userId);
        console.log('collection:', this.collection);
        console.log('id:', id);
        console.log('titulo_da_pagina:', this.titulo_da_pagina);
        console.log('subcollection:', this.subcollection);
        console.log('fichaId:', this.fichaId);
        console.log("subtitulo_da_pagina =", this.subtitulo_da_pagina);

        if (!this.id) {
          console.error('Registro não identificado.');
          this.voltar();
        }
        else {
          if (this.subcollection) {
            this.FormService.loadFicha(this.userId, this.collection, this.id, this.subcollection, this.fichaId, this.view_only)
              .then(() => {
                this.subtitulo_da_pagina = this.FormService.registro.nome;
              })
              .catch(error => {
                console.error('Erro ao carregar ficha:', error);
              });
          }
          else {
            this.FormService.loadRegistro(this.userId, this.collection, this.id, this.view_only)
              .then(() => {
                this.subtitulo_da_pagina = this.FormService.registro.nome;
              })
              .catch(error => {
                console.error('Erro ao carregar registro:', error);
              });
          }
        }

        // Usando setTimeout para garantir que o campo "Nome" esteja disponível após o carregamento
        setTimeout(() => {
          if (this.nomeInput) {
            this.nomeInput.nativeElement.focus();
          }
        }, 1000);

      } else {
        console.error('Usuário não autenticado.');
        this.util.goHome();
      }
    });
    console.log('Formulário de visualização inicializado.');
  }

  /**
   * Método Angular AfterViewInit (a)
   * - Ação automática (pelo framework).
   * - Chamado após a view do componente ser inicializada.
   *   Aqui, tenta focar o campo "Nome".
   */
  ngAfterViewInit() {
    if (this.nomeInput) {
      setTimeout(() => {
        this.nomeInput?.nativeElement.focus();
      }, 0);
    } else {
      console.warn('Campo "Nome" não encontrado ao inicializar. Verifique se o campo foi carregado.');
    }
  }

  /**
   * Função salvar() (b)
   * - É chamada no template (arquivo edit.component.html) quando o usuário clica para salvar.
   * - Verifica se é uma subcollection para chamar outro método ou 
   *   usa salvar_collection_anterior() para atualizar o registro.
   */
  salvar() {
    console.log('salvar()');
    if (this.userId) {

      console.log('userId:', this.userId);
      console.log('collection:', this.collection);
      console.log('id:', this.id);
      console.log('subcollection:', this.subcollection);
      console.log('fichaId:', this.fichaId);

      if (this.subcollection) {
        console.log("Salvar uma subcollection: ", this.subcollection);
        if (this.fichaId) {
          this.FormService.salvarSubcollection(this.userId, this.collection, this.id, this.subcollection, this.fichaId);
        }
      }
      else {
        console.log("Salvar uma collection: ", this.collection);
        this.salvar_collection_anterior();
      }
      this.verFicha();
    }
  }

  /**
   * Função salvar_collection_anterior() (d)
   * - Chamada apenas internamente (no próprio arquivo) dentro de salvar().
   * - Manipula o formulário e chama o serviço para persistir atualização do registro.
   */
  salvar_collection_anterior() {
    if (this.FormService.fichaForm.valid && this.userId) {
        // Converte o valor do campo email para minúsculas, se existir.
        const formValues = { ...this.FormService.fichaForm.value };
        if (formValues.email) {
            formValues.email = formValues.email.toLowerCase();
        }

        // Atualiza o registro com todos os valores do formulário, incluindo novos campos.
        const registroAtualizado = { ...this.FormService.registro, ...formValues };

        // Verifique se o ID está presente antes de salvar
        if (!this.FormService.registro.id) {
            console.error('Erro: ID do registro está indefinido. Não é possível atualizar o registro.');
            alert('Erro ao atualizar o registro. O ID está indefinido.');
            return;
        }

        const registroPath = `users/${this.userId}/${this.collection}`;
        console.log('registroPath =', registroPath);

        console.log('Tentando salvar o registro:');
        console.log('Atualizando registro no caminho:', registroPath, 'com ID:', this.FormService.registro.id);
        console.log('Dados do registro a serem atualizados:', registroAtualizado);

        const uploadPromises = Object.keys(this.arquivos).map(campoNome => {
            const file = this.arquivos[campoNome];
            const url = prompt('Insira a URL do arquivo ou imagem:');
            return new Promise<void>((resolve) => {
                registroAtualizado[campoNome] = url;
                resolve();
            });
        });

        Promise.all(uploadPromises).then(() => {
            this.firestoreService.updateRegistro(registroPath, this.FormService.registro.id, registroAtualizado)
                .then(() => {
                    this.router.navigate([`/view/${this.collection}`, this.FormService.registro.id]);
                })
                .catch(error => {
                    console.error('Erro ao salvar o registro:', error);
                    alert('Erro ao salvar o registro. Por favor, tente novamente.');
                });
        });
    } else {
        console.error('Registro inválido ou sem ID:', this.FormService.registro);
        alert('Registro inválido ou sem ID. Não é possível salvar.');
    }
  }

  /**
   * Função verFicha() (d)
   * - Chamada apenas internamente (no próprio arquivo) no final de salvar().
   * - Responsável por navegar para o caminho de visualização (view) do registro ou da ficha.
   */
  verFicha() {
    console.log("verFicha()");

    const fichaPath = this.subcollection ?
      `/view-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens/${this.fichaId}` :
      `view/${this.collection}/${this.id}`;

    this.router.navigate([fichaPath]);
  }

  /**
   * Função voltar() (b / também interna)
   * - Geralmente é chamada via (click)="voltar()" no template (se houver) 
   *   ou internamente (por exemplo, quando o registro não é encontrado).
   * - Retorna à rota de visualização do registro.
   */
  voltar() {
    console.log("voltar()");
    console.log("subcollection =", this.subcollection);

    const viewPath = this.subcollection ?
      `/view-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens/${this.fichaId}` :
      `view/${this.collection}/${this.id}`;

    this.router.navigate([viewPath]);
  }

}