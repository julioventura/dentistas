import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importa o serviço de Storage
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService<T extends { id?: string }> {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) { }


  // CREATE: Adicionar um novo registro à subcoleção do usuário
  addRegistro(collectionPath: string, registro: T): Promise<void> {
    const id = registro.id ? registro.id : this.createId(); // Garante que o campo id seja preenchido
    const registroComId = { ...registro, id }; // Insere o campo id
    return this.firestore.collection(collectionPath).doc(id).set(registroComId);
  }


  // Altere o método para aceitar uma função de consulta como argumento opcional
  getRegistros(path: string, queryFn?: QueryFn) {
    return this.afs.collection<T>(path, queryFn).valueChanges({ idField: 'id' });
  }

  // Método para obter uma coleção inteira
  getColecao(collectionPath: string): Observable<T[]> {
    return this.firestore.collection<T>(collectionPath).valueChanges();
  }

  // READ: Buscar registro por ID (usado para perfis pessoais, baseado no UID)
  getRegistroById(collectionPath: string, id: string): Observable<any | undefined> {
    return this.firestore.collection<any>(collectionPath).doc(id).valueChanges();
  }

  // READ: Buscar registro por username na subcoleção do usuário (para o perfil público)
  getRegistroByUsername(collectionPath: string, username: string): Observable<any | undefined> {
    return this.firestore.collection<any>(collectionPath, ref => ref.where('username', '==', username)).valueChanges();
  }


  // UPDATE: Atualizar um registro existente (usado para salvar os dados do perfil do usuário)
  updateRegistro(collectionPath: string, id: string, registro: Partial<T>): Promise<void> {
    if (!id) {
      console.error('Erro: ID do registro é indefinido. Não é possível atualizar.');
      return Promise.reject(new Error('ID do registro é indefinido.'));
    }

    console.log(`Atualizando registro no caminho: ${collectionPath}, com ID: ${id}`);
    console.log('Dados do registro a serem atualizados:', registro);

    return this.firestore.collection(collectionPath).doc(id).update(registro)
      .then(() => {
        console.log('Registro atualizado com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao atualizar o registro:', error);
        throw new Error('Erro ao atualizar o registro: ' + error.message);
      });
  }



  // DELETE: Deletar um registro pelo ID na subcoleção do usuário
  deleteRegistro(collectionPath: string, id: string): Promise<void> {
    console.log("deleteRegistro(" + collectionPath + ', ' + id + ")" );
    return this.firestore.collection(collectionPath).doc(id).delete();
  }

  // Método para criar um ID único (caso seja necessário)
  createId(): string {
    return this.firestore.createId();
  }

  // Método para gerar o próximo código sequencial com dígito verificador na subcoleção do usuário
  gerarProximoCodigo(collectionPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getRegistros(collectionPath).subscribe(registros => {
        let novoCodigo = '001'; // Começa com '001' se for o primeiro

        if (registros && registros.length > 0) {
          const codigos = registros.map((r: any) => r.codigo ? r.codigo.split('-')[0] : '001');
          const ultimoCodigo = Math.max(...codigos.map(c => parseInt(c, 10)));
          const proximoCodigo = (ultimoCodigo + 1).toString().padStart(3, '0');
          novoCodigo = proximoCodigo;
        }

        const digitoVerificador = this.calcularDigitoVerificador(novoCodigo);
        resolve(`${novoCodigo}-${digitoVerificador}`);
      }, error => {
        reject('Erro ao gerar o próximo código.');
      });
    });
  }

  // Função para calcular o dígito verificador
  calcularDigitoVerificador(codigo: string): number {
    return codigo.split('').reduce((acc, num) => acc + parseInt(num, 10), 0) % 10;
  }

  // Método para fazer upload de arquivos no Firebase Storage
  uploadFile(path: string, file: File): Observable<string> {
    const filePath = `${path}/${file.name}`; // Define o caminho no Firebase Storage
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string>(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            observer.next(url); // Retorna a URL do arquivo após o upload
            observer.complete();
          });
        })
      ).subscribe();
    });
  }

  // Método para deletar um arquivo do Firebase Storage
  deleteFile(fileUrl: string): Promise<void> {
    return this.storage.refFromURL(fileUrl).delete().toPromise();
  }



}
