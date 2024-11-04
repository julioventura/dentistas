import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as Papa from 'papaparse';

import { UtilService } from '../shared/util.service';
import { NavegacaoService } from '../shared/navegacao.service';

@Component({
  selector: 'app-importar-cadastro',
  templateUrl: './importar-cadastro.component.html',
  styleUrls: ['./importar-cadastro.component.scss']
})
export class ImportarCadastroComponent {
  userId: string | null = null;
  csvData: any[] = [];
  importStatus: string = '';
  selectedCollection: string = 'pacientes'; // Coleção padrão selecionada

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    public util: UtilService,
    private navegacaoService: NavegacaoService,
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result: { data: any[]; }) => {
          this.csvData = result.data;
          console.log('Dados CSV carregados:', this.csvData);
        },
        error: (error) => {
          console.error('Erro ao processar o arquivo:', error);
        }
      });
    }
  }

  async importarDados() {
    if (!this.userId || this.csvData.length === 0) {
      this.importStatus = 'Por favor, selecione um arquivo CSV válido.';
      return;
    }

    this.importStatus = 'Importando dados...';

    const batch = this.firestore.firestore.batch();
    const collectionPath = `/users/${this.userId}/${this.selectedCollection}`;
    const selectedCollectionRef = this.firestore.collection(collectionPath).ref;

    for (const registro of this.csvData) {
      const docRef = selectedCollectionRef.doc(); // Gera um novo documento com um ID automático
      const registroComId = { ...registro, id: docRef.id }; // Adiciona o campo `id` ao registro
      batch.set(docRef, registroComId); // Adiciona o registro ao batch com o ID incluído
    }

    batch.commit().then(() => {
      this.importStatus = `Importação concluída com sucesso para a coleção ${this.selectedCollection}!`;
      console.log(`Dados importados com sucesso para a coleção ${this.selectedCollection}:`, this.csvData);
    }).catch((error) => {
      console.error('Erro ao importar dados:', error);
      this.importStatus = 'Erro ao importar os dados.';
    });
  }

  voltar() {
    this.navegacaoService.goBack();
  }
}
