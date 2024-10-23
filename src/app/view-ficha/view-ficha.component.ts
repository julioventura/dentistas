import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/util.service';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-view-ficha',
  templateUrl: './view-ficha.component.html',
  styleUrls: ['./view-ficha.component.scss'],
})
export class ViewFichaComponent implements OnInit {
  userId: string | null = null;
  collection!: string;
  subCollection!: string; // Sub-coleção (exames, etc.)
  registro: any = null;
  id!: string;
  fichaId: string | null = null; // Pode ser null se não houver fichaId
  fichas: any[] = []; // Lista de fichas (exames, atendimentos, etc.)
  ficha: any = null;  // Detalhes de uma ficha específica
  campos: any[] = [];
  camposIniciais: any[] = []; // Armazena os campos ao carregar a página
  titulo_da_pagina: string = '';
  subtitulo_da_pagina: string = '';
  view_ficha: boolean = true;
  isLoading = true;   // Indicador de carregamento  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService<any>,
    private afAuth: AngularFireAuth,
    public util: UtilService,
    public FormService: FormService,

  ) { }

  ngOnInit(): void {
    console.log('ngOnInit()');

    this.afAuth.authState.subscribe((user) => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.subCollection = this.route.snapshot.paramMap.get('subcollection')!;
        this.fichaId = this.route.snapshot.paramMap.get('fichaId') || null;
        this.titulo_da_pagina = "Ficha de " + this.util.capitalizar(this.subCollection);
        this.subtitulo_da_pagina = this.FormService.id_nome_collected;
        
        console.log('userId:', this.userId); 
        console.log('Collection:', this.collection);
        console.log('ID:', this.id);
        console.log('subCollection:', this.subCollection);
        console.log('fichaId:', this.fichaId); 

        if (!this.fichaId) {
          console.error('Ficha não identificada.');
          this.voltar();
        }
        else {
          this.FormService.loadFicha(this.userId, this.collection, this.id, this.subCollection, this.fichaId, this.view_ficha);
        }
      }
      else {
        console.error('Usuário não autenticado.');
        this.util.goHome();
      }
    });
    console.log('Formulário de visualização inicializado.');
  }




  editar() {
    console.log('editar()');

    const editarPath = `/edit-ficha/${this.collection}/${this.id}/ficha/${this.subCollection}/itens/${this.fichaId}`;
    console.log('editar - Navegando para edição da ficha:', editarPath);
    this.router.navigate([editarPath]);
  }

  excluir() {
    if (!this.fichaId) {
      console.error('Nenhum ID de ficha para excluir.');
      return;
    }

    // Confirmação de exclusão
    const confirmacao = confirm('Tem certeza de que deseja excluir esta ficha?');
    if (!confirmacao) {
      return; // Se o usuário cancelar, não faz nada
    }

    // Caminho da ficha a ser excluída
    const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;

    console.log('Tentando excluir a ficha com ID:', this.fichaId);
    console.log('Caminho da ficha para exclusão:', fichaPath);

    // Chama a função de exclusão do FirestoreService
    this.firestoreService.deleteRegistro(fichaPath, this.fichaId)
      .then(() => {
        console.log('Ficha excluída com sucesso.');
        // Redireciona para a lista de fichas após a exclusão
        this.router.navigate([`/list-fichas/${this.collection}/${this.id}/ficha/${this.subCollection}`]);
      })
      .catch(error => {
        console.error('Erro ao excluir a ficha:', error);
      });
  }


  voltar(): void {
    this.fichaId = null;
    this.router.navigate([`/list-fichas/${this.collection}/${this.id}/ficha/${this.subCollection}/`]);
  }


  // criarNovaFicha(): void {
  //   console.log('criarNovaFicha()');

  //   const novaFicha = {
  //     nome: 'bbbbbbbbb',
  //     descricao: '333333',
  //     data: new Date().toISOString().split('T')[0],
  //   };

  //   const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;
  //   console.log('Tentando criar nova ficha no caminho:', fichaPath);
  //   console.log('Conteúdo da nova ficha:', novaFicha);

  //   this.firestore.collection(fichaPath).add(novaFicha).then(docRef => {
  //     console.log('Nova ficha criada com sucesso com ID:', docRef.id);
  //     this.router.navigate([`/view-ficha/${this.collection}/${this.id}/ficha/${this.subCollection}/itens/${docRef.id}`]);
  //   }).catch((error) => {
  //     console.error('Erro ao criar nova ficha:', error);
  //   });
  // }

}
