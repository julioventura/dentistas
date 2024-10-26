import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/util.service';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})

export class ViewComponent implements OnInit {
  userId: string | null = null;
  collection!: string;
  subcollection!: string;
  registro: any = null;
  id!: string;
  view_only: boolean = true;
  fichaId: string = '';
  titulo_da_pagina: string = '';
  subtitulo_da_pagina: string = '';
  mostrar_menu: boolean = false;
  isLoading = true;
  registroPath: string = '';
  routePath: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private afAuth: AngularFireAuth,
    public util: UtilService,
    public FormService: FormService,
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
        this.titulo_da_pagina = this.subcollection ? this.util.titulo_ajuste_singular(this.subcollection) : this.util.titulo_ajuste_singular(this.collection);
        this.mostrar_menu = (this.collection == 'pacientes' && !this.subcollection) ? true : false;

        console.log('userId:', this.userId);
        console.log('collection:', this.collection);
        console.log('id:', id);
        console.log('titulo_da_pagina:', this.titulo_da_pagina);
        console.log('subcollection:', this.subcollection);
        console.log('fichaId:', this.fichaId);

        if (!this.id) {
          console.error('Registro não identificado.');
          this.voltar();
        }
        else {
          if (this.subcollection) {
            this.FormService.loadFicha(this.userId, this.collection, this.id, this.subcollection, this.fichaId, this.view_only);
          }
          else {
            this.FormService.loadRegistro(this.userId, this.collection, this.id, this.view_only);
          }

          // Verifica se o registro foi carregado antes de acessar o nome
          if (this.FormService.registro && this.FormService.registro.nome) {
            console.log("this.FormService.registro", this.FormService.registro);
            this.subtitulo_da_pagina = this.FormService.registro.nome;
          } else {
            console.error('Registro ou nome não disponível.');
          }
        }
      }
      else {
        console.error('Usuário não autenticado.');
        this.util.goHome();
      }
    });
    console.log('Formulário de visualização inicializado.');
  }

  verFichaDoMenu(subcollection: string) {
    console.log('verFichaDoMenu(subcollection)');
    console.log('subcollection =', subcollection);

    const viewPath = `/list-fichas/${this.collection}/${this.id}/fichas`;
    console.log('viewPath = ', viewPath);
    this.router.navigate([`/list-fichas/${this.collection}/${this.id}/fichas`, subcollection]);
  }

  editar() {
    console.log('editar()');

    // console.log('userId:', this.userId);
    // console.log('collection:', this.collection);
    // console.log('id:', this.id);
    // console.log('subcollection:', this.subcollection);
    // console.log('fichaId:', this.fichaId);

    if (this.subcollection) {
      const editPath = `/edit-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens`;
      console.log("editPath =", editPath);
      console.log("fichaId =", this.fichaId);
      this.router.navigate([editPath, this.fichaId]);
    }
    else {
      const editPath = `/edit/${this.collection}`;
      console.log("editPath =", editPath);
      console.log("id =", this.id);
      this.router.navigate([editPath, this.id]);
    }
  }

  excluir() {
    console.log("excluir()");

    // console.log("this.userId = " + this.userId);
    // console.log("collection =", this.collection);
    // console.log("this.id = " + this.id);
    // console.log("subcollection =", this.subcollection);
    // console.log("this.fichaId = " + this.fichaId);
    // console.log("registroPath = " + this.registroPath);

    if (confirm('Você tem certeza que deseja excluir este registro?')) {

      let registro_id = '';

      if (this.subcollection) {
        this.registroPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subcollection}/itens`;
        this.routePath = `/list-fichas/${this.collection}/${this.id}/fichas/${this.subcollection}`;
        registro_id = this.fichaId;
      }
      else {
        this.registroPath = `users/${this.userId}/${this.collection}`;
        this.routePath = `list/${this.collection}`;
        registro_id = this.id;
      }

      this.firestoreService.deleteRegistro(this.registroPath, registro_id)
        .then(() => {
          alert('Registro excluido.');
          this.router.navigate([this.routePath]);
        })
        .catch((error) => {
          console.error('Erro ao excluir o registro:', error);
        });
    }
  }

  voltar() {
    console.log("voltar()");
    console.log("subcollection =", this.subcollection);

    const listaPath = this.subcollection ?
      `/list-fichas/${this.collection}/${this.id}/fichas/${this.subcollection}` :
      `list/${this.collection}`;

    this.router.navigate([listaPath]);
  }

}
