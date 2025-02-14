import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CamposFichaService {
  public camposPadrao: any[] = [
    { nome: 'nome', tipo: 'text', label: 'Nome' },
    { nome: 'data', tipo: 'text', label: 'Data' },
    { nome: 'valor', tipo: 'text', label: 'Valor' },
    { nome: 'obs', tipo: 'textarea', label: 'Obs' },
    { nome: 'nuvem', tipo: 'url', label: 'Arquivos' },
    { nome: 'id', tipo: 'text', label: 'ID' }
  ];

  private configPath: string = '';

  constructor(private firestore: AngularFirestore) { }

  getCamposRegistro(userId: string, colecao: string): Observable<any[]> {
    this.configPath = `users/${userId}/configuracoesFichas`;
    if (colecao === 'padrao') {
      return of([...this.camposPadrao]);
    } else {
      return this.firestore.collection(this.configPath).doc(colecao).valueChanges().pipe(
        switchMap((config: any) => {
          return of(config ? config.campos : []);
        })
      );
    }
  }

  setCamposRegistro(userId: string, colecao: string, campos: any[]): Promise<void> {
    this.configPath = `users/${userId}/configuracoesFichas`;
    if (colecao === 'padrao') {
      this.camposPadrao = campos;
      return Promise.resolve();
    } else {
      return this.firestore.collection(this.configPath).doc(colecao).set({ campos });
    }
  }

  getColecoes(userId: string): Observable<any[]> {
    this.configPath = `users/${userId}/configuracoesFichas`;
    return this.firestore.collection(this.configPath).snapshotChanges().pipe(
      switchMap(actions => {
        const colecoes = actions.map(a => a.payload.doc.id);
        return of(colecoes);
      })
    );
  }
}
