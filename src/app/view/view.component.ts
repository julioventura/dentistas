/* 
  Métodos do componente ViewComponent:
  1. ngOnInit() - Inicializa o componente; subscreve o estado de autenticação, obtém os parâmetros de rota e chama os serviços para carregar os dados do registro.
  2. editar() - Redireciona para a rota de edição, diferenciando entre registro principal e ficha interna (subcollection).
  3. excluir() - Exclui o registro ou ficha interna após confirmação do usuário, utilizando o caminho correto no Firestore.
  4. voltar() - Navega de volta à lista de registros ou fichas internas, conforme o contexto.
  5. getDynamicFields() - Retorna os nomes dos campos dinâmicos (que não fazem parte dos campos predefinidos) presentes no FormGroup.
*/

import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/utils/util.service';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None // desativa o encapsulamento para permitir o uso global de variáveis CSS
})
export class ViewComponent implements OnInit {
  userId: string | null = null; // ID do usuário autenticado
  collection!: string;          // Nome da coleção
  subcollection!: string;       // Nome da subcollection, se houver
  registro: any = null;         // Dados carregados do registro
  id!: string;                  // ID do registro principal
  view_only: boolean = true;    // Define se está em modo visualização
  fichaId: string = '';         // ID da ficha interna, se aplicável
  titulo_da_pagina: string = '';    // Título da página
  subtitulo_da_pagina: string = ''; // Subtítulo da página
  isLoading = true;             // Flag de carregamento
  registroPath: string = '';    // Caminho para operações com o registro
  routePath: string = '';       // Caminho da rota para redirecionamentos
  show_menu: boolean = false;   // Controla exibição de menus adicionais
  menu_exame: boolean = false;  // Flag específica para exame (se necessário)
  // Propriedade usada no binding CSS para definir a largura do label
  customLabelWidthValue: number = 200;
  customLabelWidth: string = `${this.customLabelWidthValue}px`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private afAuth: AngularFireAuth,
    public util: UtilService,
    public FormService: FormService
  ) { }

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

        if (!this.collection || !this.id) {
          console.warn('Collection ou ID não foram passados corretamente.');
          return;
        }

        // Define o título da página conforme a existência de subcollection
        this.titulo_da_pagina = this.subcollection
          ? this.util.titulo_ajuste_singular(this.subcollection)
          : this.util.titulo_ajuste_singular(this.collection);

        console.log('userId:', this.userId);
        console.log('collection:', this.collection);
        console.log('id:', this.id);
        console.log('titulo_da_pagina:', this.titulo_da_pagina);
        console.log('subcollection:', this.subcollection);
        console.log('fichaId:', this.fichaId);

        if (!this.id) {
          console.error('Registro não identificado.');
          this.voltar();
        } 
        else {
          if (this.subcollection) {
            console.log('Carregando ficha interna...');
            console.log('loadFicha()');
            console.log('Colledction :', this.collection);
            console.log('Subcolledction :', this.subcollection);

            this.FormService.loadFicha(this.userId, this.collection, this.id, this.subcollection, this.fichaId, this.view_only);
          } 
          else {
            console.log('Colledction :', this.collection);
            console.log('loadRegistro()');

            this.FormService.loadRegistro(this.userId, this.collection, this.id, this.view_only);
          }

          // Define o subtítulo da página com base no nome do registro
          this.subtitulo_da_pagina = this.FormService.nome_in_collection;
          console.log('subtitulo_da_pagina:', this.subtitulo_da_pagina);

          // Exibe o menu se estiver na visualização do registro principal
          this.show_menu = !!(this.collection && this.id && !this.subcollection);
        }

        // Ajuste da largura dos labels baseado em critério (ex.: coleção "dentesendo")
        if (this.subcollection === 'dentesendo') {
          this.customLabelWidthValue = 400;
        } else {
          this.customLabelWidthValue = 250;
        }
        this.updateCustomLabelWidth();

      } else {
        console.error('Usuário não autenticado.');
        this.util.goHome();
      }
    });
    console.log('ViewComponent inicializado.');
  }

  updateCustomLabelWidth() {
    this.customLabelWidth = `${this.customLabelWidthValue}px`;
  }

  // Campos fixos para o container 1 
  // (apenas se preenchidos, exceto 'nome' que é exibido sempre)
  get fixedFields(): any[] {
    const fixed = ['nome', 'data', 'nuvem', 'obs'];
    return this.FormService.campos.filter(campo => {
      if (fixed.includes(campo.nome)) {
        if (campo.nome === 'nome') {
          return true; // Exibe sempre o campo "nome"
        }
        const valor = this.FormService.registro[campo.nome];
        return valor != null && String(valor).trim().length > 0;
      }
      return false;
    });
  }


   // Getter para os demais campos (Container 2)
   // Apenas se preenchidos.
  get adjustableFields(): any[] {
    const fixed = ['nome', 'data', 'nuvem', 'obs'];
    return this.FormService.campos.filter(campo => {
      if (!fixed.includes(campo.nome)) {
        const valor = this.FormService.registro[campo.nome];
        return valor != null && String(valor).trim().length > 0;
      }
      return false;
    });
  }

  editar() {
    console.log('editar()');
    if (this.subcollection) {
      const editPath = `/edit-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens`;
      console.log("editPath =", editPath);
      console.log("fichaId =", this.fichaId);
      this.router.navigate([editPath, this.fichaId]);
    } else {
      const editPath = `/edit/${this.collection}`;
      console.log("editPath =", editPath);
      console.log("id =", this.id);
      this.router.navigate([editPath, this.id]);
    }
  }

  excluir() {
    console.log("excluir()");
    if (confirm('Você tem certeza que deseja excluir este registro?')) {
      let registro_id = '';
      if (this.subcollection) {
        this.registroPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subcollection}/itens`;
        this.routePath = `/list-fichas/${this.collection}/${this.id}/fichas/${this.subcollection}`;
        registro_id = this.fichaId;
      } else {
        this.registroPath = `users/${this.userId}/${this.collection}`;
        this.routePath = `list/${this.collection}`;
        registro_id = this.id;
      }
      this.firestoreService.deleteRegistro(this.registroPath, registro_id)
        .then(() => {
          this.router.navigate([this.routePath]);
        })
        .catch(error => {
          console.error('Erro ao excluir o registro:', error);
        });
    }
  }

  voltar() {
    console.log("voltar()");
    const listaPath = this.subcollection ?
      `/list-fichas/${this.collection}/${this.id}/fichas/${this.subcollection}` :
      `list/${this.collection}`;
    this.router.navigate([listaPath]);
  }

  getDynamicFields(): string[] {
    const predefinedFields = this.FormService.campos.map(campo => campo.nome);
    return Object.keys(this.FormService.fichaForm.controls).filter(
      campoNome => !predefinedFields.includes(campoNome)
    );
  }

  
  openUrl(url: string): void {
    console.log("openUrl()");
    if (url && url.trim().length > 0) {
      window.open(url, '_blank');
    }
  }

}
