import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilService } from '../shared/util.service';

@Component({
  selector: 'app-list-fichas',
  templateUrl: './list-fichas.component.html',
  styleUrl: './list-fichas.component.scss'
})
export class ListFichasComponent implements OnInit {
  collection!: string;
  subCollection!: string; // Sub-coleção (exames, etc.)
  id!: string;
  fichas: any[] = []; // Lista de fichas (exames, atendimentos, etc.)
  userId: string | null = null;
  isLoading = true;   // Indicador de carregamento  
  titulo_da_pagina: string = '';
  pacienteNome: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService<any>,
    private navegacaoService: NavegacaoService,
    private afAuth: AngularFireAuth,
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

        this.loadPacienteNome();  // Carrega o nome do paciente
        this.loadAllFichas();
      }
    });

    this.id = this.route.snapshot.paramMap.get('id')!;

  }

  loadPacienteNome() {
    const pacientePath = `users/${this.userId}/${this.collection}`;
    console.log('Caminho para o paciente:', pacientePath);
    console.log('Id do paciente:', this.id);

    this.firestoreService.getRegistroById(pacientePath, this.id).subscribe(paciente => {
      if (paciente && paciente.nome) {
        this.pacienteNome = paciente.nome;
        console.log('Nome do paciente carregado:', this.pacienteNome);
        this.titulo_da_pagina = "Fichas de " + this.util.capitalizar(this.subCollection);
      } else {
        console.error('Paciente não encontrado ou sem nome.');
      }
    }, error => {
      console.error('Erro ao carregar o paciente:', error);
    });
  }

  loadAllFichas() {
    console.log('loadAllFichas()');

    console.log('Collection:', this.collection);
    console.log('ID:', this.id);
    console.log('subCollection:', this.subCollection);

    this.titulo_da_pagina = "Lista de " + this.subCollection;


    if (this.subCollection && this.userId && this.collection && this.id) {
 
      const fichasPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;
      console.log('Caminho para subcoleção (listagem de fichas):', fichasPath);

      this.firestore.collection(fichasPath)
        .snapshotChanges()
        .subscribe(actions => {
          this.fichas = actions.map(action => {
            const data = action.payload.doc.data() as { [key: string]: any };
            const id = action.payload.doc.id;
            return { id, ...data };  // Inclui o ID do documento
          });
          this.isLoading = false;

          if (this.fichas.length === 0) {
            console.log('Nenhuma ficha encontrada.');
          } else {
            console.log('Fichas carregadas:', this.fichas);
          }
        });
    } 
    else {
      console.error('Erro: Variáveis necessárias não foram definidas corretamente.');
    }
  }

 
  incluir(): void {
    console.log('criarNovaFicha()');

    const novaFicha = {
      nome: '_novo_registro',
      descricao: '',
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

  verFicha(fichaId: string) {
    console.log('verFicha()');

    const fichaPath = `/view-ficha/${this.collection}/${this.id}/ficha/${this.subCollection}/itens/${fichaId}`;
    console.log('verFicha(' + fichaId + ') - Navegando para ficha:', fichaPath);
    this.router.navigate([fichaPath]);
  }


  voltar(): void {
    this.router.navigate([`/view/${this.collection}/${this.id}`]);
  }
}

