/* 
  Métodos do serviço CamposFichaService:
  1. getCamposFichaRegistro(userId: string, subcollection: string): Observable<any[]>
     - Retorna os campos de configuração para uma subcollection (ex.: exames).
       Se a subcollection for "padrao", retorna os campos padrão para fichas;
       caso contrário, busca a configuração no Firestore e, se não existir, utiliza os padrões.
  2. setCamposFichaRegistro(userId: string, collection: string, campos: any[]): Promise<void>
     - Atualiza os campos de configuração de uma subcollection para o usuário.
       Para "padrao", atualiza o array de campos padrão localmente; para outros, grava a configuração no Firestore.
  3. getColecoes(userId: string): Observable<any[]>
     - Recupera as subcollections configuradas para fichas do usuário a partir do Firestore, retornando os IDs dos documentos.
*/

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CamposFichaService {
  // Array contendo os campos padrão para registros gerais (ex.: pacientes).
  public camposPadrao: any[] = [
    { nome: 'nome', tipo: 'text', label: 'Nome' },
    { nome: 'codigo', tipo: 'text', label: 'Código' },
    { nome: 'data', tipo: 'text', label: 'Data' },
    { nome: 'valor', tipo: 'text', label: 'Valor' },
    { nome: 'obs', tipo: 'textarea', label: 'Obs' },
    { nome: 'nuvem', tipo: 'url', label: 'Arquivos' },
  ];

  // Array padrão para fichas (como exames)
  public camposPadraoFichas: any[] = [
    { nome: 'nome', tipo: 'text', label: 'Titulo' },
    { nome: 'data', tipo: 'date', label: 'Data do Exame' },
    { nome: 'obs', tipo: 'textarea', label: 'Observações' },
    { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
    { nome: 'resultado', tipo: 'textarea', label: 'Resultado' },
  ];

  // Mapeamento dos campos padrão para subcollections específicas
  public defaultCampos: { [key: string]: any[] } = {
    exames: [
      { nome: 'titulo', tipo: 'text', label: 'Titulo' },
      { nome: 'data', tipo: 'date', label: 'Data do Exame' },
      { nome: 'resultado', tipo: 'textarea', label: 'Resultado' },
      { nome: 'nome', tipo: 'text', label: 'Nome' },
      { nome: 'codigo', tipo: 'text', label: 'Código' }
    ]
    // ...adicione outras subcollections se necessário...
  };

  // Caminho de configuração para acessar subcollections no Firestore
  private configPath: string = '';

  // Construtor: Injeção do AngularFirestore
  constructor(private firestore: AngularFirestore) { 
    console.log('CamposFichaService constructor called');
  }

  // Retorna os campos de configuração para uma subcollection.
  // Se a subcollection for "padrao", retorna os camposPadraoFichas.
  // Caso contrário, tenta buscar a configuração personalizada no Firestore.
  // Se não houver configuração, usa os campos padrão definidos em defaultCampos ou revertendo para camposPadraoFichas.
  getCamposFichaRegistro(userId: string, subcollection: string): Observable<any[]> {
    console.log('getCamposFichaRegistro called with', { userId, subcollection });
    this.configPath = `users/${userId}/configuracoesFichas`;
    console.log("configPath = ", this.configPath);
    console.log("subcollection = ", subcollection);

    if (subcollection === 'padrao') {
      return of([...this.camposPadraoFichas]); // Retorna uma cópia dos campos padrão para fichas
    } else {
      console.log("else... (subcollection diferente de padrao)");
      return this.firestore
        .collection(this.configPath)
        .doc(subcollection)
        .valueChanges()
        .pipe(
          switchMap((configuracaoFirestore: any) => {
            if (configuracaoFirestore && configuracaoFirestore.campos) {
              console.log("configuracaoFirestore.campos = ", configuracaoFirestore.campos);
              return of(configuracaoFirestore.campos);
            } else if (this.defaultCampos[subcollection]) {
              console.log("else if... (usando campos padrão para a subcollection)");
              return of([...this.defaultCampos[subcollection]]);
            } else {
              console.log("else... (usando campos padrão gerais)");
              return of([...this.camposPadraoFichas]);
            }
          })
        );
    }
  }

  // Atualiza os campos de configuração para uma subcollection.
  // Se a collection for 'padrao', atualiza localmente; caso contrário, grava os campos no Firestore.
  setCamposFichaRegistro(userId: string, collection: string, campos: any[]): Promise<void> {
    console.log('setCamposRegistro called with', { userId, collection, campos });
    this.configPath = `users/${userId}/configuracoesFichas`;
    if (collection === 'padrao') {
      this.camposPadrao = campos;
      return Promise.resolve();
    } else {
      return this.firestore.collection(this.configPath).doc(collection).set({ campos });
    }
  }

  // Recupera uma lista de subcollections (configurações de fichas) do Firestore para o usuário.
  // Utiliza snapshotChanges para extrair os IDs dos documentos.
  getColecoes(userId: string): Observable<any[]> {
    console.log('getColecoes called with', { userId });
    this.configPath = `users/${userId}/configuracoesFichas`;
    return this.firestore.collection(this.configPath).snapshotChanges().pipe(
      switchMap(actions => {
        const colecoes = actions.map(a => a.payload.doc.id);
        return of(colecoes);
      })
    );
  }
}
