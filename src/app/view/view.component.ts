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
  registro: any = null;
  id!: string;
  view_only: boolean = true;
  titulo_da_pagina: string = '';
  subtitulo_da_pagina: string = '';
  isLoading = true;

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
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) { this.id = id; }
        this.titulo_da_pagina = this.util.capitalizar(this.collection);

        console.log('userId:', this.userId);
        console.log('Collection:', this.collection);
        console.log('ID:', id);
        console.log('titulo_da_pagina:', this.titulo_da_pagina); 

        if (!this.id) {
          console.error('Registro não identificado.');
          this.voltar();
        }
        else {
          this.FormService.loadRegistro(this.userId, this.collection, this.id, this.view_only);

          this.subtitulo_da_pagina = this.FormService.registro.nome;
          console.log("subtitulo_da_pagina = " + this.subtitulo_da_pagina);
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
    this.router.navigate([`/list-fichas/${this.collection}/${this.id}/ficha`, subcollection]);
  }


  editar() {
    this.router.navigate([`/edit/${this.collection}`, this.id]);
  }

  excluir() {
    console.log("excluir()");

    const registroPath = `users/${this.userId}/${this.collection}`;
    console.log("this.userId = " + this.userId);
    console.log("registroPath = " + registroPath);
    console.log("this.id = " + this.id);

    if (confirm('Você tem certeza que deseja excluir este registro?')) {
      this.firestoreService.deleteRegistro(registroPath, this.id)
        .then(() => {
          this.router.navigate([`/registros/${this.collection}`]);
        })
        .catch((error) => {
          console.error('Erro ao excluir o registro:', error);
        });
    }
  }

  voltar() {
    this.router.navigate([`/registros/${this.collection}`]);
  }

}
