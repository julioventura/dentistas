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
    { nome: 'id', tipo: 'text', label: 'ID' }
  ];

  public camposPadraoFichas: any[] = [
    { nome: 'titulo', tipo: 'text', label: 'Titulo' },
    { nome: 'data', tipo: 'date', label: 'Data do Exame' },
    { nome: 'resultado', tipo: 'textarea', label: 'Resultado' }
  ];

  // Mapeamento de campos padrão para subcollections específicas.
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

  // Caminho de configuração que será utilizado para acessar subcoleções no Firestore.
  private configPath: string = '';

  // Construtor: Injeção de dependência do AngularFirestore.
  constructor(private firestore: AngularFirestore) { 
    // Rastreia a criação da instância do serviço.
    console.log('CamposFichaService constructor called');
  }

  // Função getCamposRegistro:
  // - Para 'padrao' retorna os camposPadrao.
  // - Para outras subcollections, tenta buscar a configuração personalizada.
  // - Se não houver configuração no Firebase e houver um default definido para a subcollection, retorna-o.
  // - Caso contrário, retorna os camposPadrao.

  getCamposFichaRegistro(userId: string, subcollection: string): Observable<any[]> {
    console.log('getCamposFichaRegistro called with', { userId, subcollection });
    this.configPath = `users/${userId}/configuracoesFichas`;
    console.log("configPath = ", this.configPath);
    console.log("subcollection = ", subcollection);

    if (subcollection === 'padrao') {
      return of([...this.camposPadraoFichas]); // Retorna os campos padrão se a coleção for "padrao"
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
              return of(configuracaoFirestore.campos); // Se existir configuração no Firestore, use-a
            } else if (this.defaultCampos[subcollection]) {
              console.log("else if... (usando campos padrão para a subcollection)");
              return of([...this.defaultCampos[subcollection]]); // Se houver campos padrão para a subcollection, use-os
            } else {
              console.log("else... (usando campos padrão gerais)");
              return of([...this.camposPadraoFichas]); // Caso contrário, use uma cópia dos campos padrão gerais
            }
          })
        );
    }
  }

  // Função setCamposFichaRegistro:
  // - Atualiza os campos de registro para um usuário.
  // - Se a coleção for 'padrao', atualiza o array de campos padrão.
  // - Caso contrário, escreve os campos no documento especificado na coleção do Firestore.
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

  // Função getColecoes:
  // - Recupera as coleções de configurações de fichas de um usuário.
  // - Utiliza snapshotChanges() para obter os IDs dos documentos e os retorna.
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
