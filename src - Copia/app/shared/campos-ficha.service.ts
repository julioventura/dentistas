import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CamposFichaService {

  // Configurações padrão para todas as coleções
  public camposPadrao: any[] = [
    { nome: 'nome', tipo: 'text', label: 'Nome' },
    { nome: 'data', tipo: 'text', label: 'Data' },
    { nome: 'valor', tipo: 'text', label: 'Valor' },
    { nome: 'obs', tipo: 'textarea', label: 'Obs' },
    { nome: 'nuvem', tipo: 'url', label: 'Arquivos' },
    { nome: 'id', tipo: 'text', label: 'ID' },
  ];

  private configPath: string = '';

  constructor(private firestore: AngularFirestore) { }

  // Método para obter os campos de uma coleção específica do Firestore ou carregar os padrões
  getCamposRegistro(userId: string, colecao: string): Observable<any[]> {
    this.configPath = 'users/' + userId + '/configuracoesFichas';

    if (colecao === 'padrao') {
      return of([...this.camposPadrao]); // Retorna os campos padrão se a coleção for "padrao"
    } else {
      return this.firestore.collection(this.configPath).doc(colecao).valueChanges().pipe(
        switchMap((configuracaoFirestore: any) => {
          if (configuracaoFirestore && configuracaoFirestore.campos) {
            return of(configuracaoFirestore.campos); // Se existir configuração no Firestore, use-a
          } else {
            return of([...this.camposPadrao]); // Caso contrário, use uma cópia dos campos padrão
          }
        })
      );
    }
  }

  // Método para salvar ou atualizar as configurações da coleção no Firestore
  setCamposRegistro(userId: string, colecao: string, campos: any[]): Promise<void> {
    this.configPath = 'users/' + userId + '/configuracoesFichas';

    if (colecao === 'padrao') {
      this.camposPadrao = campos; // Atualiza os campos padrão localmente
      return Promise.resolve();
    } else {
      return this.firestore.collection(this.configPath).doc(colecao).set({ campos });
    }
  }

  // Método para obter todas as coleções salvas no Firestore
  getColecoes(userId: string): Observable<any[]> {
    this.configPath = 'users/' + userId + '/configuracoesFichas';

    return this.firestore.collection(this.configPath).snapshotChanges().pipe(
      switchMap(actions => {
        const colecoes = actions.map(action => action.payload.doc.id);
        return of(colecoes);
      })
    );
  }
}
