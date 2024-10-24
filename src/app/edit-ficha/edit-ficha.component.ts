import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UtilService } from '../shared/util.service';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-edit-ficha',
  templateUrl: '../edit/edit.component.html',
  styleUrls: ['../edit/edit.component.scss']
})
export class EditFichaComponent implements OnInit {
  userId!: string;
  collection!: string;
  subCollection!: string;
  registro: any = {};
  id!: string;
  fichaId: string | null = null; // Pode ser null se não houver fichaId
  ficha: any;
  isNew = false;
  campos: any[] = [];
  arquivos: { [key: string]: File } = {};
  view_only: boolean = false;
  titulo_da_pagina: string = '';
  subtitulo_da_pagina: string = '';
  isLoading = true;


  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService<any>,
    private navegacaoService: NavegacaoService,
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
        this.titulo_da_pagina = "Editar " + this.util.capitalizar(this.subCollection);
        this.subtitulo_da_pagina = this.FormService.id_nome_collected;

        console.log('userId:', this.userId); 
        console.log('Collection:', this.collection);
        console.log('ID:', this.id);
        console.log('subCollection:', this.subCollection);
        console.log('fichaId:', this.fichaId); 
        console.log('titulo_da_pagina:', this.titulo_da_pagina); 

        if (this.fichaId) {
          this.FormService.loadFicha(this.userId, this.collection, this.id, this.subCollection, this.fichaId, this.view_only);
        } else {
          this.isNew = true;
          this.gerarNovoRegistro();  // Gera um ID e cria um registro temporário
        }
    
      }
      else { console.error('Usuário não autenticado.'); this.util.goHome(); }
    });
    console.log('Formulário de edição de ficha inicializado.');
  }


  onFileSelected(event: any, campoNome: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.arquivos[campoNome] = file;
    }
  }


  gerarNovoRegistro() {
    if (!this.userId || !this.collection) return;

    this.firestoreService.gerarProximoCodigo(`users/${this.userId}/${this.collection}`).then(novoCodigo => {
      const id = this.firestoreService.createId();
      this.registro = {
        id,
        codigo: novoCodigo,
        ...this.campos.reduce((acc, campo) => ({ ...acc, [campo.nome]: '' }), {})
      };

      console.log('Novo registro gerado (temporário):', this.registro);
    });
  }

  
  salvar() {
    if (this.fichaId) {
      this.FormService.salvar(this.userId, this.collection, this.id, this.subCollection, this.fichaId);
    }
  }

  voltar(): void {
    this.navegacaoService.goBack();
  }
}
