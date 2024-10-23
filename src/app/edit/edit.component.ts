import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UtilService } from '../shared/util.service';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  encapsulation: ViewEncapsulation.None // Remova o encapsulamento

})
export class EditComponent implements OnInit {
  userId: string | null = null;
  collection!: string;
  registro: any = {};
  id!: string;
  isNew = false;
  arquivos: { [key: string]: File } = {};
  view_ficha: boolean = false;
  titulo_da_pagina: string = '';
  subtitulo_da_pagina: string = '';
  isLoading = true;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private navegacaoService: NavegacaoService,
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
        if (id) { this.id = id;}
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
          this.FormService.loadRegistro(this.userId, this.collection, this.id, this.view_ficha);

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

  

  salvar() {
    if (this.FormService.fichaForm.valid && this.userId) {
      const registroAtualizado = { ...this.FormService.registro, ...this.FormService.fichaForm.value };

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


  voltar() {
    this.navegacaoService.goBack();
  }
}
