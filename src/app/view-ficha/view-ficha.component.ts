import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { UserService } from '../shared/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CamposFichaService } from '../shared/campos-ficha.service';
import { UtilService } from '../shared/util.service';

@Component({
  selector: 'app-view-ficha',
  templateUrl: './view-ficha.component.html',
  styleUrls: ['./view-ficha.component.scss'],
})
export class ViewFichaComponent implements OnInit {
  collection!: string;
  subCollection!: string; // Sub-coleção (exames, etc.)
  registro: any = null;
  id!: string;
  fichaId: string | null = null; // Pode ser null se não houver fichaId
  fichas: any[] = []; // Lista de fichas (exames, atendimentos, etc.)
  ficha: any = null;  // Detalhes de uma ficha específica
  userId: string | null = null;
  campos: any[] = [];
  camposIniciais: any[] = []; // Armazena os campos ao carregar a página
  isLoading = true;   // Indicador de carregamento  
  titulo_da_pagina: string = '';
  collectionNome: string = '';


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService<any>,
    private navegacaoService: NavegacaoService,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private camposFichasService: CamposFichaService,
    public util: UtilService

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
        this.carregarCampos();
        this.loadCollectionNome();

        console.log('Collection:', this.collection);
        console.log('ID:', this.id);
        console.log('subCollection:', this.subCollection);

        if (this.fichaId) {
          // Carregar detalhes de uma ficha específica
          console.log('fichaId:', this.fichaId);

          this.loadFicha();
        }
      }
    });
  }



  carregarCampos() {
    console.log('carregarCampos()');

    this.camposFichasService.getCamposFicha(this.subCollection).subscribe((campos: any[]) => {
      this.campos = campos || [];
      this.camposIniciais = JSON.parse(JSON.stringify(campos));

      console.log('campos');
      console.log(this.campos);
      console.log('camposIniciais');
      console.log(this.camposIniciais);

    }, (error) => {
      console.error(`Erro ao carregar campos da coleção ${this.subCollection}:`, error);
    });  
  }


  loadCollectionNome() {
    const collectionPath = `users/${this.userId}/${this.collection}`;
    console.log('Caminho para o collection:', collectionPath);
    console.log('Id do collection:', this.id);

    this.firestoreService.getRegistroById(collectionPath, this.id).subscribe(collection => {
      if (collection && collection.nome) {
        this.collectionNome = collection.nome;
        console.log('Nome do collection carregado:', this.collectionNome);
        this.titulo_da_pagina = "Fichas de " + this.util.capitalizar(this.subCollection);
      } else {
        console.error('Collection não encontrado ou sem nome.');
      }
    }, error => {
      console.error('Erro ao carregar o collection:', error);
    });
  }

  loadFicha() {
    console.log('loadFicha()');
    console.log('Collection:', this.collection);
    console.log('ID:', this.id);
    console.log('subCollection:', this.subCollection);
    console.log('fichaId:', this.fichaId);

    if (this.subCollection && this.fichaId) {
      const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;

      console.log('Caminho para ficha específica:', fichaPath);

      this.firestoreService.getRegistroById(fichaPath, this.fichaId).subscribe((ficha) => {
        this.ficha = ficha;
        this.registro = ficha;  // <-- Certifique-se de que registro está sendo preenchido
        this.isLoading = false;
        console.log('Ficha carregada com sucesso:', this.ficha);
      }, error => {
        console.error('Erro ao carregar a ficha:', error);
      });
    } else {
      console.error('Erro: subCollection ou fichaId não definidos corretamente.');
    }
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


  criarNovaFicha(): void {
    console.log('criarNovaFicha()');

    const novaFicha = {
      nome: 'bbbbbbbbb',
      descricao: '333333',
      data: new Date().toISOString().split('T')[0],
    };

    const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;
    console.log('Tentando criar nova ficha no caminho:', fichaPath);
    console.log('Conteúdo da nova ficha:', novaFicha);

    this.firestore.collection(fichaPath).add(novaFicha).then(docRef => {
      console.log('Nova ficha criada com sucesso com ID:', docRef.id);
      this.router.navigate([`/view-ficha/${this.collection}/${this.id}/ficha/${this.subCollection}/itens/${docRef.id}`]);
    }).catch((error) => {
      console.error('Erro ao criar nova ficha:', error);
    });
  }
}
