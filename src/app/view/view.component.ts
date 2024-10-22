import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CamposService } from '../shared/campos.service';
import { UtilService } from '../shared/util.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  collection!: string;
  registro: any = null;
  id!: string;
  isLoading = true;
  titulo_da_pagina: string = '';
  userId: string | null = null;
  campos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private afAuth: AngularFireAuth,
    private camposService: CamposService,
    public util: UtilService

  ) { }

  ngOnInit() {
    console.log('ngOnInit()');
   
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.titulo_da_pagina = this.util.capitalizar(this.collection);

        console.log('userId:', this.userId);
        console.log('Collection:', this.collection);
        console.log('ID:', this.id);

        this.carregarCampos();

        if (this.id && this.collection) {
          this.titulo_da_pagina = "Ficha de " + this.util.titulo_ajuste(this.collection);
          this.loadRegistro(this.id);
        }
        else {
          // In case no user is authenticated, navigate to home
          this.router.navigate(['/home']);
        }
      }
      else {
        console.error('Usuário não autenticado.');
        this.util.goHome();
      }
    });
    console.log('Formulário de visualização inicializado.');
  }

  carregarCampos() {
    this.camposService.getCamposRegistro(this.collection).subscribe((campos: any[]) => {
      this.campos = campos || [];
    });
  }


  loadRegistro(id: string) {
    console.log("loadRegistro(" + id + ")");

    if (!this.userId) return;

    const registroPath = `users/${this.userId}/${this.collection}`;
    console.log("registroPath = " + registroPath);

    this.firestoreService.getRegistroById(registroPath, id).subscribe(registro => {
      if (registro) {
        this.registro = registro;
        console.log('Registro carregado com sucesso:', this.registro);
        this.isLoading = false;
      } else {
        console.error('Registro não encontrado.');
        alert('Registro não encontrado!');
        this.router.navigate(['/home']);
      }
    }, (error) => {
      console.error('Erro ao carregar o registro:', error);
      this.router.navigate(['/home']);
    });
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
