import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators'; // Importando catchError

@Injectable({
  providedIn: 'root'
})
export class CamposFichaService {

  // Configurações padrão para todas as fichas
  public camposFichaPadrao: any[] = [
    { nome: 'nome', tipo: 'text', label: 'Nome' },
    { nome: 'descricao', tipo: 'text', label: 'Descrição' },
    { nome: 'valor', tipo: 'number', label: 'Valor' },
    { nome: 'data', tipo: 'date', label: 'Data' }
  ];

  constructor(private firestore: AngularFirestore) { }

  // Método para obter os campos de uma ficha específica do Firestore ou carregar os padrões
  getCamposFicha(colecao: string): Observable<any[]> {
    console.log(`Tentando carregar campos da coleção: ${colecao}`);

    if (colecao === 'padrao') {
      console.log('Retornando campos padrão:', this.camposFichaPadrao);
      return of([...this.camposFichaPadrao]); // Retorna os campos padrão se a coleção for "padrao"
    } else {
      return this.firestore.collection('configuracoesFichas').doc(colecao).valueChanges().pipe(
        switchMap((configuracaoFirestore: any) => {
          if (configuracaoFirestore && configuracaoFirestore.campos && configuracaoFirestore.campos.length > 0) {
            console.log(`Configuração carregada do Firestore para a coleção ${colecao}:`, configuracaoFirestore.campos);
            return of(configuracaoFirestore.campos); // Se houver configuração válida no Firestore, use-a
          } else {
            console.warn(`Nenhuma configuração válida encontrada para ${colecao}. Usando campos padrão.`);
            return of([...this.camposFichaPadrao]); // Fallback para campos padrão
          }
        }),
        catchError((error) => {  // Usando o catchError aqui para capturar erros
          console.error('Erro ao carregar campos do Firestore:', error);
          return of([...this.camposFichaPadrao]); // Em caso de erro, retorna os campos padrão
        })
      );
    }
  }

  // Método para salvar ou atualizar as configurações da coleção no Firestore
  setCamposFicha(colecao: string, campos: any[]): Promise<void> {
    console.log(`Salvando campos para a coleção ${colecao}:`, campos);

    if (colecao === 'padrao') {
      this.camposFichaPadrao = campos; // Atualiza os campos padrão localmente
      console.log('Campos padrão atualizados:', this.camposFichaPadrao);
      return Promise.resolve();
    } else {
      return this.firestore.collection('configuracoesFichas').doc(colecao).set({ campos })
        .then(() => {
          console.log(`Campos salvos com sucesso no Firestore para a coleção ${colecao}`);
        })
        .catch((error) => {
          console.error(`Erro ao salvar campos para a coleção ${colecao}:`, error);
        });
    }
  }

  // Método para obter todas as coleções salvas no Firestore
  getColecoesFichas(): Observable<any[]> {
    console.log('Carregando todas as coleções do Firestore.');

    return this.firestore.collection('configuracoesFichas').snapshotChanges().pipe(
      switchMap(actions => {
        const colecoes = actions.map(action => action.payload.doc.id);
        console.log('Coleções carregadas:', colecoes);
        return of(colecoes);
      }),
      catchError((error) => {  // Usando o catchError para tratar erros ao carregar as coleções
        console.error('Erro ao carregar coleções do Firestore:', error);
        return of([]); // Em caso de erro, retorna uma lista vazia
      })
    );
  }
}
