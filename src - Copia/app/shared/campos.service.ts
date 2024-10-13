import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CamposService {

  // Configurações padrão para todas as coleções
  public camposPadrao: any[] = [
    { nome: 'nome', tipo: 'text', label: 'Nome' },
    { nome: 'codigo', tipo: 'text', label: 'Código' },
    { nome: 'sexo', tipo: 'text', label: 'Sexo' },
    { nome: 'nascimento', tipo: 'text', label: 'Nascimento' },
    { nome: 'whatsapp', tipo: 'text', label: 'WhatsApp' },
    { nome: 'telefone', tipo: 'text', label: 'Telefone' },
    { nome: 'endereço', tipo: 'text', label: 'Endereço' },
    { nome: 'bairro', tipo: 'text', label: 'Bairro' },
    { nome: 'cidade', tipo: 'text', label: 'Cidade' },
    { nome: 'estado', tipo: 'text', label: 'Estado' },
    { nome: 'cpf', tipo: 'text', label: 'CPF' },
    { nome: 'id', tipo: 'text', label: 'ID' },
  ];

  constructor(private firestore: AngularFirestore) { }

  // Método para obter os campos de uma coleção específica do Firestore ou carregar os padrões
  getFormularios(colecao: string): Observable<any[]> {
    if (colecao === 'padrao') {
      return of([...this.camposPadrao]); // Retorna os campos padrão se a coleção for "padrao"
    } else {
      return this.firestore.collection('configuracoesCampos').doc(colecao).valueChanges().pipe(
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
  setFormularios(colecao: string, campos: any[]): Promise<void> {
    if (colecao === 'padrao') {
      this.camposPadrao = campos; // Atualiza os campos padrão localmente
      return Promise.resolve();
    } else {
      return this.firestore.collection('configuracoesCampos').doc(colecao).set({ campos });
    }
  }

  // Método para obter todas as coleções salvas no Firestore
  getColecoes(): Observable<any[]> {
    return this.firestore.collection('configuracoesCampos').snapshotChanges().pipe(
      switchMap(actions => {
        const colecoes = actions.map(action => action.payload.doc.id);
        return of(colecoes);
      })
    );
  }
}
