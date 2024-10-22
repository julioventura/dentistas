import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavegacaoService } from '../shared/navegacao.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/util.service';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-edit-ficha',
  templateUrl: './edit-ficha.component.html',
  styleUrls: ['./edit-ficha.component.scss']
})
export class EditFichaComponent implements OnInit {
  collection!: string;
  subCollection!: string;
  registro: any = {};
  id!: string;
  fichaId: string | null = null; // Pode ser null se não houver fichaId
  ficha: any;
  userId!: string;
  titulo_da_pagina: string = '';
  campos: any[] = [];
  arquivos: { [key: string]: File } = {};
  view_ficha: boolean = false;

  constructor(
    private route: ActivatedRoute,
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
    console.log('Formulário de edição de ficha inicializado.');
  }


  onFileSelected(event: any, campoNome: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.arquivos[campoNome] = file;
    }
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
