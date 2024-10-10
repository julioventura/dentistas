import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService<T extends { id?: string }> {
  constructor(private firestore: AngularFirestore) { }

  // CREATE: Adicionar um novo registro à subcoleção do usuário
  addRegistro(collectionPath: string, registro: T): Promise<void> {
    const id = registro.id ? registro.id : this.createId();
    const registroComId = { ...registro, id };
    return this.firestore.collection(collectionPath).doc(id).set(registroComId);
  }

  // READ: Buscar todos os registros da subcoleção do usuário
  getRegistros(collectionPath: string): Observable<T[]> {
    return this.firestore.collection<T>(collectionPath).valueChanges({ idField: 'id' });
  }

  // READ: Buscar registro por ID na subcoleção do usuário
  getRegistroById(collectionPath: string, id: string): Observable<T | undefined> {
    return this.firestore.collection<T>(collectionPath).doc(id).valueChanges();
  }

  // UPDATE: Atualizar um registro existente na subcoleção do usuário
  updateRegistro(collectionPath: string, id: string, registro: Partial<T>): Promise<void> {
    return this.firestore.collection(collectionPath).doc(id).update(registro);
  }

  // DELETE: Deletar um registro pelo ID na subcoleção do usuário
  deleteRegistro(collectionPath: string, id: string): Promise<void> {
    return this.firestore.collection(collectionPath).doc(id).delete();
  }

  // Método para criar um ID único
  createId(): string {
    return this.firestore.createId();
  }

  // Método para gerar o próximo código sequencial com dígito verificador na subcoleção do usuário
  gerarProximoCodigo(collectionPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getRegistros(collectionPath).subscribe(registros => {
        let novoCodigo = '001'; // Começa com '001' se for o primeiro

        if (registros && registros.length > 0) {
          // Verifica se 'codigo' existe antes de tentar fazer o 'split'
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
}
